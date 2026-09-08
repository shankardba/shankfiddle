// Wavetable-scrubber audio engine.
//
// The close-price series is resampled to a fixed-length buffer (independent of how
// many bars are loaded, so the start/stop window behaves the same at 1M or Max
// range) and normalized to [-1, 1] as raw PCM. An AudioBufferSourceNode loops a
// user-selected window of that buffer — loopStart/loopEnd is literally "start/stop
// point in the wavetable", and playbackRate is "speed". Because loop length in
// samples determines pitch (freq = sampleRate / loopLengthInSamples), a short
// window sounds like a pitched tone and a long window sounds like a slow drone —
// the shape of the price curve becomes the waveform's timbre.
(function () {
  const RESAMPLE_LENGTH = 4096;

  function resampleLinear(values, targetLen) {
    const n = values.length;
    if (n === 0) return new Float32Array(targetLen);
    if (n === 1) return new Float32Array(targetLen).fill(values[0]);
    const out = new Float32Array(targetLen);
    const scale = (n - 1) / (targetLen - 1);
    for (let i = 0; i < targetLen; i++) {
      const pos = i * scale;
      const i0 = Math.floor(pos);
      const i1 = Math.min(n - 1, i0 + 1);
      const frac = pos - i0;
      out[i] = values[i0] * (1 - frac) + values[i1] * frac;
    }
    return out;
  }

  function normalizeToUnitRange(arr) {
    let min = Infinity, max = -Infinity;
    for (const v of arr) {
      if (v < min) min = v;
      if (v > max) max = v;
    }
    const range = max - min || 1;
    const out = new Float32Array(arr.length);
    for (let i = 0; i < arr.length; i++) out[i] = ((arr[i] - min) / range) * 2 - 1;
    return out;
  }

  class WavetableScrubber {
    constructor() {
      this.ctx = null;
      this.gain = null;
      this.source = null;
      this.buffer = null;
      this.resampled = null;
      this.startFrac = 0;
      this.stopFrac = 0.08;
      this.speed = 1;
      this.volume = 0.5;
      this.playing = false;
    }

    _ensureContext() {
      if (!this.ctx) {
        this.ctx = new (window.AudioContext || window.webkitAudioContext)();
        this.gain = this.ctx.createGain();
        this.gain.gain.value = this.volume;
        this.gain.connect(this.ctx.destination);
      }
      return this.ctx;
    }

    setBars(bars) {
      const closes = bars.map((b) => b.close);
      this.resampled = normalizeToUnitRange(resampleLinear(closes, RESAMPLE_LENGTH));
      this._rebuildBuffer();
    }

    _rebuildBuffer() {
      if (!this.resampled || !this.resampled.length) {
        this.buffer = null;
        return;
      }
      const ctx = this._ensureContext();
      const buffer = ctx.createBuffer(1, this.resampled.length, ctx.sampleRate);
      buffer.copyToChannel(this.resampled, 0);
      this.buffer = buffer;
      this._applyLoopPoints();
    }

    _applyLoopPoints() {
      if (!this.source || !this.buffer) return;
      const dur = this.buffer.duration;
      const start = this.startFrac * dur;
      const end = Math.max(start + dur * 0.002, this.stopFrac * dur);
      this.source.loopStart = start;
      this.source.loopEnd = end;
    }

    setLoopWindow(startFrac, stopFrac) {
      this.startFrac = Math.max(0, Math.min(1, startFrac));
      this.stopFrac = Math.max(this.startFrac + 0.002, Math.min(1, stopFrac));
      this._applyLoopPoints();
    }

    setSpeed(speed) {
      this.speed = speed;
      if (this.source) this.source.playbackRate.value = speed;
    }

    setVolume(v) {
      this.volume = v;
      if (this.gain) this.gain.gain.setTargetAtTime(v, this.ctx.currentTime, 0.02);
    }

    play() {
      if (!this.buffer) return false;
      const ctx = this._ensureContext();
      if (ctx.state === 'suspended') ctx.resume();
      this.stop();
      const source = ctx.createBufferSource();
      source.buffer = this.buffer;
      source.loop = true;
      source.playbackRate.value = this.speed;
      source.connect(this.gain);
      this.source = source;
      this._applyLoopPoints();
      source.start();
      this.playing = true;
      return true;
    }

    stop() {
      if (this.source) {
        try { this.source.stop(); } catch {}
        this.source.disconnect();
        this.source = null;
      }
      this.playing = false;
    }

    toggle() {
      if (this.playing) {
        this.stop();
        return false;
      }
      return this.play();
    }
  }

  window.WavetableScrubber = WavetableScrubber;

  // Trailing volatility (stddev of returns over a short window), normalized to
  // [0,1] against its own max. Drives filter brightness so turbulent stretches
  // sound grittier and calm stretches sound cleaner — a more musical signal than
  // any single bar's own high-low range.
  function computeVolatility(bars, windowSize = 10) {
    const n = bars.length;
    const returns = new Array(n).fill(0);
    for (let i = 1; i < n; i++) {
      const prev = bars[i - 1].close;
      returns[i] = prev ? (bars[i].close - prev) / prev : 0;
    }
    const vol = new Array(n).fill(0);
    for (let i = 0; i < n; i++) {
      const start = Math.max(0, i - windowSize + 1);
      const slice = returns.slice(start, i + 1);
      const mean = slice.reduce((a, b) => a + b, 0) / slice.length;
      const variance = slice.reduce((a, b) => a + (b - mean) ** 2, 0) / slice.length;
      vol[i] = Math.sqrt(variance);
    }
    const maxVol = Math.max(...vol, 1e-9);
    return vol.map((v) => v / maxVol);
  }

  // Resamples a bar series to an EXACT target length (unlike chart.js's
  // downsampleOHLC, which only caps a maximum). Used to line up a comparison
  // symbol's bars index-for-index with the primary symbol's, even if the two
  // series have slightly different lengths (different listing history, etc.),
  // so multiple tracks stay in lockstep — same index plays at the same time.
  function resampleBarsExact(bars, targetLen) {
    const n = bars.length;
    if (n === 0 || targetLen <= 0) return [];
    if (n === targetLen) return bars;
    const out = new Array(targetLen);
    for (let i = 0; i < targetLen; i++) {
      const startIdx = Math.floor((i / targetLen) * n);
      const endIdx = Math.max(startIdx + 1, Math.floor(((i + 1) / targetLen) * n));
      const slice = bars.slice(startIdx, Math.min(endIdx, n));
      if (!slice.length) {
        out[i] = bars[Math.min(startIdx, n - 1)];
        continue;
      }
      let high = -Infinity, low = Infinity, volume = 0;
      for (const b of slice) {
        if (b.high > high) high = b.high;
        if (b.low < low) low = b.low;
        volume += b.volume;
      }
      out[i] = { date: slice[0].date, t: slice[0].t, open: slice[0].open, close: slice[slice.length - 1].close, high, low, volume };
    }
    return out;
  }

  // Sonic candlestick: one scheduled note per bar per track, playhead sweeps the
  // chart. Pitch glides open->close (quantized to a scale if enabled), filter
  // brightness blends the day's own high-low range with trailing volatility,
  // velocity tracks volume, and up/down days get distinct envelope character
  // (a bright plucked attack vs. a duller thud). An optional percussion layer
  // adds a volume-driven filtered noise hit under each note. Supports multiple
  // simultaneous tracks (e.g. comparing tickers), panned apart for clarity.
  // All notes are scheduled up front against precise AudioContext times — cheap
  // for Web Audio even at a few hundred notes per track, and avoids a rolling
  // scheduler for a bounded, non-live sequence.
  class SonicCandlestick {
    constructor() {
      this.ctx = null;
      this.master = null;
      this.tracks = []; // [{ symbol, bars, priceLo, priceHi, volMax, volatility }]
      this.notesPerSecond = 8;
      this.playing = false;
      this.scheduledNodes = [];
      this.startCtxTime = 0;
      this.secondsPerBar = 0.125;
      this.quantize = true;
      this.scaleName = 'majorPentatonic';
      this.percussion = false;
      this.onPlayheadUpdate = null;
      this.onEnded = null;
      this._rafId = null;
      this._endTimeout = null;
      this._noiseBuffer = null;
    }

    _ensureContext() {
      if (!this.ctx) {
        this.ctx = new (window.AudioContext || window.webkitAudioContext)();
        this.master = this.ctx.createGain();
        this.master.gain.value = 0.5;
        this.master.connect(this.ctx.destination);
      }
      return this.ctx;
    }

    _ensureNoiseBuffer() {
      if (this._noiseBuffer) return this._noiseBuffer;
      const ctx = this._ensureContext();
      const len = Math.floor(ctx.sampleRate * 0.3);
      const buffer = ctx.createBuffer(1, len, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < len; i++) data[i] = Math.random() * 2 - 1;
      this._noiseBuffer = buffer;
      return buffer;
    }

    // tracks: [{ symbol, bars }] — bars should already be the same length across
    // tracks (see setTracksFromRaw) so index i plays at the same time in each.
    setTracks(tracks) {
      this.tracks = tracks.map((t) => {
        let lo = Infinity, hi = -Infinity, volMax = 0;
        for (const b of t.bars) {
          if (b.low < lo) lo = b.low;
          if (b.high > hi) hi = b.high;
          if (b.volume > volMax) volMax = b.volume;
        }
        return {
          symbol: t.symbol,
          bars: t.bars,
          priceLo: isFinite(lo) ? lo : 0,
          priceHi: isFinite(hi) ? hi : 1,
          volMax: volMax || 1,
          volatility: computeVolatility(t.bars),
        };
      });
    }

    // Convenience: raw (un-aligned) per-symbol bars, resampled to a common length.
    setTracksFromRaw(rawTracks, targetLen) {
      this.setTracks(rawTracks.map((t) => ({ symbol: t.symbol, bars: resampleBarsExact(t.bars, targetLen) })));
    }

    setBars(bars, symbol = '') {
      this.setTracks([{ symbol, bars }]);
    }

    setVolume(v) {
      this._ensureContext();
      this.master.gain.setTargetAtTime(v, this.ctx.currentTime, 0.02);
    }

    setNotesPerSecond(n) {
      this.notesPerSecond = n;
    }

    setQuantize(on, scaleName) {
      this.quantize = on;
      if (scaleName) this.scaleName = scaleName;
    }

    setPercussion(on) {
      this.percussion = on;
    }

    _priceToFreq(price, track) {
      const span = track.priceHi - track.priceLo || 1;
      const t = Math.max(0, Math.min(1, (price - track.priceLo) / span));
      const minF = 110, maxF = 880; // A2..A5
      const freq = minF * Math.pow(maxF / minF, t);
      return this.quantize && window.MusicalScales ? window.MusicalScales.quantize(freq, this.scaleName) : freq;
    }

    play() {
      if (!this.tracks.length || !this.tracks[0].bars.length) return false;
      const ctx = this._ensureContext();
      if (ctx.state === 'suspended') ctx.resume();
      this.stop();

      const secondsPerBar = 1 / this.notesPerSecond;
      this.secondsPerBar = secondsPerBar;
      const startAt = ctx.currentTime + 0.1;
      this.startCtxTime = startAt;
      const numTracks = this.tracks.length;
      const barCount = this.tracks[0].bars.length;

      this.tracks.forEach((track, ti) => {
        const pan = numTracks === 1 ? 0 : (ti / (numTracks - 1)) * 1.2 - 0.6; // spread -0.6..0.6
        track.bars.forEach((bar, i) => {
          this._scheduleNote(track, bar, i, startAt + i * secondsPerBar, secondsPerBar * 0.88, pan, numTracks);
        });
      });

      this.playing = true;
      this._startPlayheadLoop();
      const totalDur = barCount * secondsPerBar;
      this._endTimeout = setTimeout(() => {
        this.stop();
        if (this.onEnded) this.onEnded();
      }, (totalDur + 0.3) * 1000);
      return true;
    }

    _scheduleNote(track, bar, i, t0, dur, pan, numTracks) {
      const ctx = this.ctx;
      const up = bar.close >= bar.open;
      const balance = 1 / Math.sqrt(numTracks); // keep multi-track mixes from clipping

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.Q.value = 0.6;

      const freqOpen = this._priceToFreq(bar.open, track);
      const freqClose = this._priceToFreq(bar.close, track);
      osc.frequency.setValueAtTime(Math.max(20, freqOpen), t0);
      osc.frequency.linearRampToValueAtTime(Math.max(20, freqClose), t0 + dur);
      osc.type = up ? 'sawtooth' : 'triangle';

      const priceSpan = track.priceHi - track.priceLo || 1;
      const rangeFrac = Math.max(0, Math.min(1, (bar.high - bar.low) / (priceSpan * 0.08)));
      const volFrac = track.volatility[i] || 0;
      const brightnessFrac = 0.5 * rangeFrac + 0.5 * volFrac;
      filter.frequency.value = (350 + brightnessFrac * 5000) * (up ? 1 : 0.7);

      const velocity = (0.12 + 0.6 * Math.min(1, bar.volume / track.volMax)) * balance;
      // Up days pluck (fast attack, brighter); down days thud (softer attack, duller).
      const attack = up ? Math.min(0.006, dur * 0.15) : Math.min(0.05, dur * 0.4);
      gain.gain.setValueAtTime(0.0001, t0);
      gain.gain.linearRampToValueAtTime(velocity, t0 + attack);
      gain.gain.exponentialRampToValueAtTime(0.0005, t0 + dur);

      osc.connect(filter);
      filter.connect(gain);
      if (ctx.createStereoPanner) {
        const panner = ctx.createStereoPanner();
        panner.pan.value = pan;
        gain.connect(panner);
        panner.connect(this.master);
      } else {
        gain.connect(this.master);
      }
      osc.start(t0);
      osc.stop(t0 + dur + 0.05);
      this.scheduledNodes.push(osc);

      if (this.percussion) {
        const noiseSrc = ctx.createBufferSource();
        noiseSrc.buffer = this._ensureNoiseBuffer();
        const noiseFilter = ctx.createBiquadFilter();
        noiseFilter.type = 'highpass';
        noiseFilter.frequency.value = 2000 + velocity * 3000;
        const noiseGain = ctx.createGain();
        const hitVel = velocity * 0.5;
        noiseGain.gain.setValueAtTime(0.0001, t0);
        noiseGain.gain.linearRampToValueAtTime(hitVel, t0 + 0.002);
        noiseGain.gain.exponentialRampToValueAtTime(0.0005, t0 + Math.min(0.06, dur * 0.5));
        noiseSrc.connect(noiseFilter);
        noiseFilter.connect(noiseGain);
        if (ctx.createStereoPanner) {
          const noisePanner = ctx.createStereoPanner();
          noisePanner.pan.value = pan;
          noiseGain.connect(noisePanner);
          noisePanner.connect(this.master);
        } else {
          noiseGain.connect(this.master);
        }
        noiseSrc.start(t0);
        noiseSrc.stop(t0 + 0.1);
        this.scheduledNodes.push(noiseSrc);
      }
    }

    _startPlayheadLoop() {
      const barCount = this.tracks[0] ? this.tracks[0].bars.length : 0;
      const tick = () => {
        if (!this.playing) return;
        const elapsed = this.ctx.currentTime - this.startCtxTime;
        const idx = Math.floor(elapsed / this.secondsPerBar);
        if (this.onPlayheadUpdate) {
          this.onPlayheadUpdate(idx >= 0 && idx < barCount ? idx : null);
        }
        this._rafId = requestAnimationFrame(tick);
      };
      this._rafId = requestAnimationFrame(tick);
    }

    stop() {
      this.scheduledNodes.forEach((o) => { try { o.stop(); } catch {} });
      this.scheduledNodes = [];
      if (this._rafId) cancelAnimationFrame(this._rafId);
      if (this._endTimeout) clearTimeout(this._endTimeout);
      this._rafId = null;
      this._endTimeout = null;
      this.playing = false;
      if (this.onPlayheadUpdate) this.onPlayheadUpdate(null);
    }

    toggle() {
      if (this.playing) {
        this.stop();
        return false;
      }
      return this.play();
    }
  }

  window.SonicCandlestick = SonicCandlestick;
})();

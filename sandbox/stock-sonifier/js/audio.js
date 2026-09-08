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

  // Sonic candlestick: one scheduled note per bar, playhead sweeps the chart.
  // Pitch glides open->close, filter brightness tracks the day's high-low range,
  // velocity tracks volume. All notes for the loaded (downsampled) bar set are
  // scheduled up front against precise AudioContext times — cheap for Web Audio
  // even at a few hundred notes, and avoids a rolling-scheduler for a bounded,
  // non-live sequence.
  class SonicCandlestick {
    constructor() {
      this.ctx = null;
      this.master = null;
      this.bars = [];
      this.notesPerSecond = 8;
      this.playing = false;
      this.scheduledNodes = [];
      this.startCtxTime = 0;
      this.secondsPerBar = 0.125;
      this.quantize = true;
      this.scaleName = 'majorPentatonic';
      this.onPlayheadUpdate = null;
      this.onEnded = null;
      this._rafId = null;
      this._endTimeout = null;
      this.priceLo = 0;
      this.priceHi = 1;
      this.volMax = 1;
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

    setBars(bars) {
      this.bars = bars;
      let lo = Infinity, hi = -Infinity, volMax = 0;
      for (const b of bars) {
        if (b.low < lo) lo = b.low;
        if (b.high > hi) hi = b.high;
        if (b.volume > volMax) volMax = b.volume;
      }
      this.priceLo = isFinite(lo) ? lo : 0;
      this.priceHi = isFinite(hi) ? hi : 1;
      this.volMax = volMax || 1;
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

    _priceToFreq(price) {
      const span = this.priceHi - this.priceLo || 1;
      const t = Math.max(0, Math.min(1, (price - this.priceLo) / span));
      const minF = 110, maxF = 880; // A2..A5
      const freq = minF * Math.pow(maxF / minF, t);
      return this.quantize && window.MusicalScales ? window.MusicalScales.quantize(freq, this.scaleName) : freq;
    }

    play() {
      if (!this.bars.length) return false;
      const ctx = this._ensureContext();
      if (ctx.state === 'suspended') ctx.resume();
      this.stop();

      const secondsPerBar = 1 / this.notesPerSecond;
      this.secondsPerBar = secondsPerBar;
      const startAt = ctx.currentTime + 0.1;
      this.startCtxTime = startAt;

      this.bars.forEach((bar, i) => {
        this._scheduleNote(bar, startAt + i * secondsPerBar, secondsPerBar * 0.88);
      });

      this.playing = true;
      this._startPlayheadLoop();
      const totalDur = this.bars.length * secondsPerBar;
      this._endTimeout = setTimeout(() => {
        this.stop();
        if (this.onEnded) this.onEnded();
      }, (totalDur + 0.3) * 1000);
      return true;
    }

    _scheduleNote(bar, t0, dur) {
      const ctx = this.ctx;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.Q.value = 0.6;

      const freqOpen = this._priceToFreq(bar.open);
      const freqClose = this._priceToFreq(bar.close);
      osc.frequency.setValueAtTime(Math.max(20, freqOpen), t0);
      osc.frequency.linearRampToValueAtTime(Math.max(20, freqClose), t0 + dur);
      osc.type = bar.close >= bar.open ? 'sawtooth' : 'triangle';

      const priceSpan = this.priceHi - this.priceLo || 1;
      const rangeFrac = Math.max(0, Math.min(1, (bar.high - bar.low) / (priceSpan * 0.08)));
      filter.frequency.value = 350 + rangeFrac * 5000;

      const velocity = 0.12 + 0.6 * Math.min(1, bar.volume / this.volMax);
      gain.gain.setValueAtTime(0.0001, t0);
      gain.gain.linearRampToValueAtTime(velocity, t0 + Math.min(0.015, dur * 0.25));
      gain.gain.exponentialRampToValueAtTime(0.0005, t0 + dur);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.master);
      osc.start(t0);
      osc.stop(t0 + dur + 0.05);
      this.scheduledNodes.push(osc);
    }

    _startPlayheadLoop() {
      const tick = () => {
        if (!this.playing) return;
        const elapsed = this.ctx.currentTime - this.startCtxTime;
        const idx = Math.floor(elapsed / this.secondsPerBar);
        if (this.onPlayheadUpdate) {
          this.onPlayheadUpdate(idx >= 0 && idx < this.bars.length ? idx : null);
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

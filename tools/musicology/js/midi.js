/* Ethno-Musicology: Standard MIDI File export for rhythms.
   Used by both sections: rhythm blocks (js/play.js, js/lessons/play.js) and the
   Cycle Lab / Groove Lab (js/labs.js, js/lessons/labs.js).

   Files are format 1: a tempo/meter track plus one percussion track per rhythm,
   all on MIDI channel 10 with General MIDI drum notes, one loopable cycle long. */
(function () {
  'use strict';
  var PPQ = 480, CH = 9;   // 480 ticks per quarter note; channel 10 (zero-based 9)

  /* Stroke -> [General MIDI percussion note, velocity]. The same letters the
     rhythm blocks and cycles use; change a sound here and every export follows. */
  var DRUMS = {
    D: [36, 112],   // dum / low stroke      -> Bass Drum 1
    T: [38, 100],   // tak / high stroke     -> Acoustic Snare
    K: [37, 84],    // ka / light stroke     -> Side Stick
    B: [56, 104],   // bell or clave stroke  -> Cowbell
    C: [39, 104],   // clap (tali)           -> Hand Clap
    W: [44, 70],    // wave (khali)          -> Pedal Hi-Hat
    X: [42, 108],   // accented pulse        -> Closed Hi-Hat, loud
    x: [42, 58]     // plain pulse           -> Closed Hi-Hat, soft
  };

  function vlq(n) {
    var out = [n & 0x7f];
    while ((n >>= 7) > 0) out.unshift((n & 0x7f) | 0x80);
    return out;
  }
  function ascii(s) {
    return String(s).normalize('NFD').replace(/[^\x20-\x7e]/g, '').split('').map(function (c) { return c.charCodeAt(0); });
  }
  function u32(n) { return [(n >>> 24) & 255, (n >>> 16) & 255, (n >>> 8) & 255, n & 255]; }
  function meta(type, data) { return [0xff, type].concat(vlq(data.length), data); }

  /* events: [{tick, order, bytes}] ; returns an MTrk chunk ending at endTick */
  function track(events, endTick) {
    events.sort(function (a, b) { return a.tick - b.tick || a.order - b.order; });
    var body = [], at = 0;
    events.forEach(function (e) {
      body = body.concat(vlq(e.tick - at), e.bytes);
      at = e.tick;
    });
    body = body.concat(vlq(Math.max(0, endTick - at)), [0xff, 0x2f, 0x00]);
    return [0x4d, 0x54, 0x72, 0x6b].concat(u32(body.length), body);
  }
  function file(tracks) {
    var head = [0x4d, 0x54, 0x68, 0x64, 0, 0, 0, 6, 0, 1, 0, tracks.length, (PPQ >> 8) & 255, PPQ & 255];
    return new Uint8Array(tracks.reduce(function (a, t) { return a.concat(t); }, head));
  }
  function hit(events, tick, stroke, len) {
    var d = DRUMS[stroke];
    if (!d) return;
    events.push({ tick: tick, order: 1, bytes: [0x90 | CH, d[0], d[1]] });
    events.push({ tick: tick + len, order: 0, bytes: [0x80 | CH, d[0], 0] });
  }
  function conductor(name, qpm, meters, total) {
    var ev = [{ tick: 0, order: 0, bytes: meta(0x03, ascii(name)) }];
    var us = Math.round(60e6 / qpm);
    ev.push({ tick: 0, order: 1, bytes: meta(0x51, [(us >> 16) & 255, (us >> 8) & 255, us & 255]) });
    var pos = 0, i = 0;
    while (meters.length && pos < total) {
      var m = meters[i % meters.length], bar = Math.round(m[0] * 4 / m[1] * PPQ);
      // nn, dd as a power of two, MIDI clocks per metronome click, 32nds per quarter
      ev.push({ tick: pos, order: 2, bytes: meta(0x58, [m[0], Math.round(Math.log(m[1]) / Math.LN2), m[1] === 8 && m[0] % 3 === 0 ? 36 : 24, 8]) });
      if (meters.length === 1) break;
      pos += bar; i++;
    }
    return track(ev, total);
  }
  function named(name, events, total) {
    events.push({ tick: 0, order: -1, bytes: meta(0x03, ascii(name)) });
    return track(events, total);
  }

  /* A token pattern as played by Labs.playPattern: `sub` tokens per beat at `bpm`.
     In x/8 meters a token is written as an eighth note; otherwise the beat is a
     quarter note split into `sub`. opts: bpm, sub, meters [[num, den], ...], title */
  function pattern(tokens, opts) {
    opts = opts || {};
    var sub = opts.sub || 2, bpm = opts.bpm || 100, meters = opts.meters || [];
    var eighths = meters.length && meters[0][1] === 8;
    var perQ = eighths ? 2 : sub;                       // tokens per quarter note
    var qpm = eighths ? bpm * sub / 2 : bpm;
    var at = function (i) { return Math.round(i * PPQ / perQ); };
    var total = at(tokens.length), len = Math.max(20, Math.round(PPQ / perQ / 2)), ev = [];
    tokens.forEach(function (tk, i) { hit(ev, at(i), tk, len); });
    var title = opts.title || 'Rhythm';
    return file([conductor(title, qpm, meters, total), named(title, ev, total)]);
  }

  /* Meters from an abc block: the M: header, then any inline [M:..] changes
     (each taken as one bar, in order, repeating). */
  function metersOf(abc) {
    var out = [];
    (abc || []).forEach(function (l) {
      var h = /^M:\s*(\d+)\/(\d+)/.exec(l);
      if (h) out.push([+h[1], +h[2]]);
      var re = /\[M:\s*(\d+)\/(\d+)\]/g, m;
      while ((m = re.exec(l))) out.push([+m[1], +m[2]]);
    });
    return out;
  }
  function block(b, tempo) {
    return pattern(b.tokens.split(/\s+/), { bpm: Math.round((b.bpm || 100) * (tempo || 1)), sub: b.sub || 2,
      meters: metersOf(b.abc), title: b.title || 'Rhythm' });
  }

  /* Cycle Lab / Groove Lab: the chosen cycles stretched to one cycle of `secs`
     seconds, one track each. The first cycle sets the grid: its pulses are
     eighth notes, so the others land as cross-rhythms against it. */
  function cycles(list, secs) {
    var n0 = list[0].n, total = n0 * PPQ / 2, qpm = (n0 / 2) * 60 / secs;
    var meter = n0 % 8 === 0 ? [4, 4] : [n0, 8];
    var name = list.map(function (c) { return c.name; }).join(' + ');
    var tracks = [conductor(name, qpm, [meter], total)];
    list.forEach(function (c) {
      var ev = [], step = total / c.n, len = Math.max(20, Math.round(step / 2)), starts = {}, g = 0;
      c.groups.forEach(function (x) { starts[g] = true; g += x; });
      var strokeAt = {};
      c.strokes.forEach(function (s) { strokeAt[s.i] = s.t; });
      for (var i = 0; i < c.n; i++) {
        var t = Math.round(i * step), st = strokeAt[i], tali = c.tali.indexOf(i) >= 0, khali = c.khali.indexOf(i) >= 0;
        if (st) hit(ev, t, st, len);
        if (tali) hit(ev, t, 'C', len);
        if (khali) hit(ev, t, 'W', len);
        if (c.beat && !st && !tali && !khali) hit(ev, t, starts[i] ? 'X' : 'x', len);
      }
      tracks.push(named(c.name, ev, total));
    });
    return file(tracks);
  }

  function slug(s) {
    return ascii(s).map(function (c) { return String.fromCharCode(c); }).join('').toLowerCase()
      .replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 60) || 'rhythm';
  }
  function download(bytes, name) {
    var url = URL.createObjectURL(new Blob([bytes], { type: 'audio/midi' })), a = document.createElement('a');
    a.href = url; a.download = slug(name) + '.mid';
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(function () { URL.revokeObjectURL(url); }, 2000);
  }

  window.Midi = { pattern: pattern, block: block, cycles: cycles, download: download, slug: slug, DRUMS: DRUMS, PPQ: PPQ };
})();

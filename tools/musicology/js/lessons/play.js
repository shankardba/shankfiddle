/* Lesson blocks: staff notation (abcjs), rhythm notation with playback,
   guitar chord diagrams, practice steps. Lessons live in data/lessons/*.json
   and are bundled into window.LESSONS.lessons by tools/build_lessons.py.

   Options passed to render(): { key, instr, tempo }
     key   semitones to move transposable blocks (concert pitch)
     instr written-pitch offset for transposing instruments (Bb +2, Eb -3);
           the staff moves by key+instr, the sound by key only
     tempo multiplier for playback speed (1 = normal) */
(function () {
  'use strict';
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]; }); }
  // allow **bold**, *italic* and [text](#/route) in short practice texts
  function md(s) { return esc(s).replace(/\[([^\]]+)\]\((#[^)]+)\)/g, '<a href="$2">$1</a>').replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>').replace(/\*(.+?)\*/g, '<em>$1</em>'); }

  var GUITAR = [40, 45, 50, 55, 59, 64];
  var BASE_QPM = 96;
  function mtof(m) { return 440 * Math.pow(2, (m - 69) / 12); }

  function chordSVG(c) {
    var fr = c.frets.split(''), nums = fr.filter(function (x) { return /\d/.test(x) && x !== '0'; }).map(Number);
    var lo = nums.length ? Math.min.apply(null, nums) : 1, hi = nums.length ? Math.max.apply(null, nums) : 1;
    var base = hi > 4 ? lo : 1, W = 92, H = 118, x0 = 14, y0 = 26, sx = 13, sy = 18;
    var s = '<svg viewBox="0 0 ' + W + ' ' + H + '" class="chord-svg" role="img" aria-label="' + esc(c.name + ' chord, frets ' + c.frets) + '">';
    s += '<text x="' + (W / 2) + '" y="12" text-anchor="middle" font-size="' + (c.name.length > 14 ? 8.5 : 11) + '" font-weight="600" fill="#2b2118">' + esc(c.name) + '</text>';
    for (var i = 0; i < 6; i++) s += '<line x1="' + (x0 + i * sx) + '" y1="' + y0 + '" x2="' + (x0 + i * sx) + '" y2="' + (y0 + 4 * sy) + '" stroke="#6b5f4e" stroke-width="1"/>';
    for (var j = 0; j <= 4; j++) s += '<line x1="' + x0 + '" y1="' + (y0 + j * sy) + '" x2="' + (x0 + 5 * sx) + '" y2="' + (y0 + j * sy) + '" stroke="#6b5f4e" stroke-width="' + (j === 0 && base === 1 ? 3 : 1) + '"/>';
    if (base > 1) s += '<text x="' + (x0 + 5 * sx + 4) + '" y="' + (y0 + sy * 0.7) + '" font-size="9" fill="#6b5f4e">' + base + 'fr</text>';
    fr.forEach(function (f, i) {
      var x = x0 + i * sx;
      if (f === 'x') s += '<text x="' + x + '" y="' + (y0 - 4) + '" text-anchor="middle" font-size="9" fill="#6b5f4e">×</text>';
      else if (f === '0') s += '<circle cx="' + x + '" cy="' + (y0 - 7) + '" r="3" fill="none" stroke="#6b5f4e"/>';
      else { var k = Number(f) - base + 1; s += '<circle cx="' + x + '" cy="' + (y0 + (k - 0.5) * sy) + '" r="5" fill="#2b2118"/>'; }
    });
    return s + '</svg>';
  }
  function chordFreqs(c) {
    var out = [];
    c.frets.split('').forEach(function (f, i) { if (/\d/.test(f)) out.push(mtof(GUITAR[i] + Number(f))); });
    return out;
  }

  var abcSynth = null;
  function stopAbc() { if (abcSynth) { try { abcSynth.stop(); } catch (e) {} abcSynth = null; } }

  function renderAbc(el, lines, visualTranspose) {
    if (!window.ABCJS) { el.innerHTML = '<pre class="abc-src">' + esc(lines.join('\n')) + '</pre><p class="tiny">Notation needs the abcjs library (internet connection).</p>'; return null; }
    // lay out for the column's width, then let the SVG scale to fit (phones, narrow columns)
    var w = Math.max(240, Math.min(720, (el.clientWidth || 600) - 12));
    var narrow = w < 420;
    var opts = { add_classes: true, responsive: 'resize', staffwidth: narrow ? 340 : w, paddingtop: 4, paddingbottom: 4, paddingleft: 4, paddingright: 4, foregroundColor: '#2b2118', wrap: { minSpacing: 1.6, maxSpacing: 2.6, preferredMeasuresPerLine: narrow ? 2 : 4 } };
    if (visualTranspose) opts.visualTranspose = visualTranspose;
    var r = window.ABCJS.renderAbc(el, lines.join('\n'), opts);
    return r && r[0];
  }

  function playAbc(vo, opt) {
    if (!vo || !window.ABCJS || !window.ABCJS.synth.supportsAudio()) return;
    window.Labs.stop();
    var s = new window.ABCJS.synth.CreateSynth();
    abcSynth = s;
    window.Labs.onStop(stopAbc);
    // abcjs subtracts the staff's visualTranspose from playback, so midiTranspose
    // alone sets the sounding (concert) key.
    s.init({ visualObj: vo, audioContext: window.Labs.audio(), options: { program: 0, qpm: Math.round(BASE_QPM * (opt.tempo || 1)), midiTranspose: opt.sound || 0 } })
      .then(function () { return s.prime(); })
      .then(function () { if (abcSynth === s) s.start(); })
      .catch(function (e) { console.warn('abcjs audio', e); });
  }

  function slideHint(key) {
    var up = (key + 12) % 12, dn = 12 - up;
    return 'Chord diagrams are shown as written, in C. Shapes with no open strings are movable: slide them ' +
      (up <= dn ? 'up ' + up + ' fret' + (up === 1 ? '' : 's') : 'down ' + dn + ' fret' + (dn === 1 ? '' : 's')) + ' for this key.';
  }

  function isPitched(lines) { return !lines.some(function (l) { return /^K:.*clef=perc/.test(l); }); }

  function block(b, opt) {
    var wrap = document.createElement('div');
    wrap.className = 'pblock pblock-' + b.type;
    var head = b.title ? '<h4>' + md(b.title) + '</h4>' : '';
    if (b.type === 'steps') {
      wrap.innerHTML = head + '<ol class="psteps">' + b.items.map(function (s) { return '<li>' + md(s) + '</li>'; }).join('') + '</ol>';
      return wrap;
    }
    if (b.type === 'note') { wrap.innerHTML = '<p class="pnote">' + md(b.text) + '</p>'; return wrap; }
    if (b.type === 'chords') {
      wrap.innerHTML = head + '<div class="chord-row">' + b.chords.map(function (c, i) {
        return '<button class="chord-btn" data-i="' + i + '" title="Strum ' + esc(c.name) + '">' + chordSVG(c) + '</button>';
      }).join('') + '</div>' + (b.caption ? '<p class="pcap">' + md(b.caption) + '</p>' : '');
      wrap.querySelectorAll('.chord-btn').forEach(function (btn) {
        btn.addEventListener('click', function () { window.Labs.strum(chordFreqs(b.chords[+btn.dataset.i])); });
      });
      return wrap;
    }
    // abc, rhythm, glide, tones
    var vt = b.transpose ? (opt.key || 0) + (opt.instr || 0) : 0;
    var badge = '';
    if (b.abc && !b.transpose && (opt.key || opt.instr) && isPitched(b.abc)) badge = '<span class="badge">' + (b.cents ? 'exact tuning: stays in its written key' : 'stays in its written key') + '</span>';
    wrap.innerHTML = head + badge + '<div class="abc-score"></div><div class="btnrow pbtns"></div>' + (b.caption ? '<p class="pcap">' + md(b.caption) + '</p>' : '');
    var score = wrap.querySelector('.abc-score'), btns = wrap.querySelector('.pbtns'), vo = null;
    if (b.abc) wrap.draw = function () { vo = renderAbc(score, b.abc, vt); };
    else score.remove();
    var play = { tempo: opt.tempo || 1, sound: b.transpose ? (opt.key || 0) : 0 };
    function addBtn(label, fn, ghost) {
      var x = document.createElement('button'); x.className = 'btn' + (ghost ? ' ghost' : ''); x.textContent = label;
      x.addEventListener('click', fn); btns.appendChild(x);
    }
    if (b.type === 'glide') {
      addBtn('▶ Play the contour', function () { window.Labs.playContour(b.points, { f0: b.f0 || 261.63 }); });
    } else if (b.type === 'tones') {
      addBtn('▶ ' + (b.label || 'Play'), function () {
        var f0 = b.f0 || 261.63; window.Labs.strum(b.cents.map(function (c) { return f0 * Math.pow(2, c / 1200); }));
      });
    } else if (b.type === 'rhythm') {
      var toks = b.tokens.split(/\s+/);
      addBtn('▶ Play the rhythm', function () { window.Labs.playPattern(toks, { bpm: Math.round((b.bpm || 100) * play.tempo), sub: b.sub || 2, loops: b.loops || 3, click: b.click !== false }); });
      if (b.abc && isPitched(b.abc)) addBtn('▶ Play the notes', function () { playAbc(vo, play); }, true);
    } else if (b.cents) {
      addBtn('▶ Play (exact tuning)', function () { window.Labs.playCents(b.cents, { step: (b.step || 0.5) / play.tempo, updown: b.updown !== false, f0: b.f0 || 261.63 }); });
    } else if (b.abc) {
      addBtn('▶ Play', function () { playAbc(vo, play); });
    }
    addBtn('Stop', function () { window.Labs.stop(); }, true);
    return wrap;
  }

  function renderBlocks(container, blocks, opt) {
    container.innerHTML = '';
    blocks.forEach(function (b) {
      var el = block(b, opt || {});
      container.appendChild(el);
      if (el.draw) el.draw();
    });
  }

  window.Play = { renderBlocks: renderBlocks, stopAbc: stopAbc, md: md, slideHint: slideHint };
})();

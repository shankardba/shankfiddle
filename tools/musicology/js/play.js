/* "Play it" panels: staff notation (abcjs), rhythm notation with playback,
   guitar chord diagrams, and practice steps. Content lives in
   data/play/*.json and is bundled into window.MUSICOLOGY.play by the build. */
(function () {
  'use strict';
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]; }); }
  // allow **bold** and *italic* in short practice texts
  function md(s) { return esc(s).replace(/\[([^\]]+)\]\((#[^)]+)\)/g, '<a href="$2">$1</a>').replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>').replace(/\*(.+?)\*/g, '<em>$1</em>'); }

  var GUITAR = [40, 45, 50, 55, 59, 64];
  function mtof(m) { return 440 * Math.pow(2, (m - 69) / 12); }

  function chordSVG(c) {
    var fr = c.frets.split(''), nums = fr.filter(function (x) { return /\d/.test(x) && x !== '0'; }).map(Number);
    var lo = nums.length ? Math.min.apply(null, nums) : 1, hi = nums.length ? Math.max.apply(null, nums) : 1;
    var base = hi > 4 ? lo : 1, W = 92, H = 118, x0 = 14, y0 = 26, sx = 13, sy = 18;
    var s = '<svg viewBox="0 0 ' + W + ' ' + H + '" class="chord-svg" role="img" aria-label="' + esc(c.name + ' chord, frets ' + c.frets) + '">';
    s += '<text x="' + (W / 2) + '" y="12" text-anchor="middle" font-size="11" font-weight="600" fill="#2b2118">' + esc(c.name) + '</text>';
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

  function renderAbc(el, lines) {
    if (!window.ABCJS) { el.innerHTML = '<pre class="abc-src">' + esc(lines.join('\n')) + '</pre><p class="tiny">Notation needs the abcjs library (internet connection).</p>'; return null; }
    var w = Math.max(260, Math.min(700, (el.parentNode.clientWidth || 600) - 40));
    var r = window.ABCJS.renderAbc(el, lines.join('\n'), { add_classes: true, scale: w < 420 ? 1 : 1.2, staffwidth: w / (w < 420 ? 1 : 1.2), paddingtop: 4, paddingbottom: 4, paddingleft: 4, paddingright: 4, foregroundColor: '#2b2118', wrap: { minSpacing: 1.6, maxSpacing: 2.6, preferredMeasuresPerLine: 4 } });
    return r && r[0];
  }

  function playAbc(vo) {
    if (!vo || !window.ABCJS || !window.ABCJS.synth.supportsAudio()) return;
    window.Labs.stop();
    var s = new window.ABCJS.synth.CreateSynth();
    abcSynth = s;
    window.Labs.onStop(stopAbc);
    s.init({ visualObj: vo, audioContext: window.Labs.audio(), options: { program: 0 } })
      .then(function () { return s.prime(); })
      .then(function () { if (abcSynth === s) s.start(); })
      .catch(function (e) { console.warn('abcjs audio', e); });
  }

  function block(b) {
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
    // abc or rhythm
    wrap.innerHTML = head + '<div class="abc-score"></div><div class="btnrow pbtns"></div>' + (b.caption ? '<p class="pcap">' + md(b.caption) + '</p>' : '');
    var score = wrap.querySelector('.abc-score'), btns = wrap.querySelector('.pbtns');
    var vo = b.abc ? renderAbc(score, b.abc) : null;
    if (!b.abc) score.remove();
    function addBtn(label, fn, ghost) {
      var x = document.createElement('button'); x.className = 'btn' + (ghost ? ' ghost' : ''); x.textContent = label;
      x.addEventListener('click', fn); btns.appendChild(x);
    }
    if (b.type === 'glide') {
      addBtn('\u25b6 Play the contour', function () { window.Labs.playContour(b.points, { f0: b.f0 || 261.63 }); });
    } else if (b.type === 'tones') {
      addBtn('\u25b6 ' + (b.label || 'Play'), function () {
        var f0 = b.f0 || 261.63; window.Labs.strum(b.cents.map(function (c) { return f0 * Math.pow(2, c / 1200); }));
      });
    } else if (b.type === 'rhythm') {
      var toks = b.tokens.split(/\s+/);
      addBtn('▶ Play the rhythm', function () { window.Labs.playPattern(toks, { bpm: b.bpm || 100, sub: b.sub || 2, loops: b.loops || 3, click: b.click !== false }); });
    } else if (b.cents) {
      addBtn('▶ Play (exact tuning)', function () { window.Labs.playCents(b.cents, { step: b.step || 0.5, updown: b.updown !== false, f0: b.f0 || 261.63 }); });
      if (vo && b.staffAudio) addBtn('▶ Play as written (piano tuning)', function () { playAbc(vo); }, true);
    } else if (vo) {
      addBtn('▶ Play', function () { playAbc(vo); });
    }
    addBtn('Stop', function () { window.Labs.stop(); }, true);
    return wrap;
  }

  function render(container, play) {
    container.innerHTML = '';
    if (!play) return;
    var h = document.createElement('div');
    h.className = 'play-head';
    h.innerHTML = '<p class="eyebrow" style="color:#8a5a1a">Play it</p><h2>How to play this</h2>' + (play.intro ? '<p>' + md(play.intro) + '</p>' : '');
    container.appendChild(h);
    play.blocks.forEach(function (b) { container.appendChild(block(b)); });
  }

  window.Play = { render: render, stopAbc: stopAbc };
})();

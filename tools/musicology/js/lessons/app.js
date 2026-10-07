/* Ethno-Musicology, "Play it: jazz" section (lessons.html): a playable course
   for jazz musicians, parallel to the Musicology atlas (index.html). Router
   and views. Content comes from window.LESSONS (tools/build_lessons.py).
   Vanilla JS, hash routing so the app works served statically or in an iframe. */
(function () {
  'use strict';
  var D = window.LESSONS, view = document.getElementById('view');
  var COURSE = {}, SKILL = {}, LESSON = {};
  D.courses.forEach(function (c) { COURSE[c.id] = c; });
  D.skills.forEach(function (s) { SKILL[s.id] = s; });
  D.lessons.forEach(function (L, i) { L.n = i; LESSON[L.id] = L; });
  // cross-section links follow the top-bar switch, so a copy that renames the
  // atlas page (shankfiddle: app.html) only changes the switch's hrefs
  function secPage(which, fallback) { var a = document.querySelector('.switch a[data-sec="' + which + '"]'); return a ? a.getAttribute('href').split('#')[0] : fallback; }
  var ATLAS_PAGE = secPage('atlas', 'index.html');

  var KEYS = [['C', 0], ['D♭', 1], ['D', 2], ['E♭', 3], ['E', 4], ['F', 5], ['G♭', -6], ['G', -5], ['A♭', -4], ['A', -3], ['B♭', -2], ['B', -1]];
  var INSTR = [['Concert (C)', 0], ['B♭ (tenor, trumpet, clarinet)', 2], ['E♭ (alto, bari)', -3]];
  var TEMPO = [['Slow', 0.65], ['Medium', 0.85], ['Full', 1]];
  var START = ['drone', 'hijaz', 'pentatonic-modes', 'clave', 'odd-meters', 'exotic-dominants'];

  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]; }); }
  function col(cid) { return (COURSE[cid] || {}).color || '#b8863b'; }
  function cdot(cid) { return '<i class="dot" style="background:' + col(cid) + '"></i>'; }
  function lessonsOf(cid) { return D.lessons.filter(function (L) { return L.course === cid; }); }
  function store(k, v) {
    try { if (v === undefined) return JSON.parse(localStorage.getItem('ethno.' + k)); localStorage.setItem('ethno.' + k, JSON.stringify(v)); } catch (e) { return null; }
  }
  var settings = store('settings') || {};
  if (typeof settings.key !== 'number') settings.key = 0;
  if (typeof settings.instr !== 'number') settings.instr = 0;
  if (typeof settings.tempo !== 'number') settings.tempo = 0.85;

  function skillChips(L) {
    return L.skills.map(function (s) { return '<a class="chip" href="#/skill/' + s + '">' + esc(SKILL[s].name) + '</a>'; }).join('');
  }
  function lessonCard(L, num) {
    var c = COURSE[L.course];
    return '<a class="card" href="#/lesson/' + L.id + '" style="border-left-color:' + c.color + '"><div class="meta">' + cdot(c.id) + esc(c.name) +
      (num ? ' · lesson ' + num : '') + '</div><h3>' + esc(L.title) + '</h3><p>' + esc(L.summary) + '</p></a>';
  }
  function courseCard(c) {
    var n = lessonsOf(c.id).length;
    return '<a class="course-card" href="#/course/' + c.id + '" style="border-top-color:' + c.color + '"><div class="rg">' + esc(c.region) + '</div><h3>' + esc(c.name) + '</h3><p>' + esc(c.blurb) + '</p><div class="ct">' + n + ' lesson' + (n === 1 ? '' : 's') + ' →</div></a>';
  }

  /* ---------------- views ---------------- */
  function home() {
    var html = '<div class="hero"><p class="eyebrow">World music for jazz players</p>' +
      '<h1>Learn to <em>play</em> the world’s melody, harmony and rhythm</h1>' +
      '<p class="lede">' + D.lessons.length + ' lessons in ' + D.courses.length + ' courses, from Indian ragas and Arabic maqam to clave, gamelan and Balkan odd meters. Every lesson gives you a little background, the material in staff notation, rhythm notation or guitar charts you can hear, a way to use it on jazz changes, and a practice plan. Pick a key and your instrument (concert, B♭ or E♭) on any lesson. For the history and theory behind each lesson, switch to the <a href="' + ATLAS_PAGE + '#/">Musicology</a> section.</p></div>' +
      '<div class="sec"><h2>How a lesson works</h2><div class="steps4">' +
      '<div class="way"><h3>1 · Background</h3><p>A few sentences: where the idea comes from and why it matters.</p></div>' +
      '<div class="way"><h3>2 · Learn it</h3><p>The scale, rhythm or phrase in notation, with playback. Play along.</p></div>' +
      '<div class="way"><h3>3 · Use it in jazz</h3><p>Which chords it fits, voicings, licks and comping patterns.</p></div>' +
      '<div class="way"><h3>4 · Practice plan</h3><p>Short, concrete exercises to tick off.</p></div></div></div>' +
      '<div class="sec"><h2>Start here</h2><p class="intro">Six lessons, one from each corner of the course, that you can use on a gig this week.</p><div class="grid">' +
      START.filter(function (i) { return LESSON[i]; }).map(function (i) { return lessonCard(LESSON[i]); }).join('') + '</div></div>' +
      '<div class="sec"><h2>Courses</h2><div class="course-grid">' + D.courses.map(courseCard).join('') + '</div></div>' +
      '<div class="sec"><h2>By skill</h2><p class="intro">Working on something specific? Each skill pulls lessons from every tradition.</p><div class="grid">' +
      D.skills.map(function (s) {
        var n = D.lessons.filter(function (L) { return L.skills.indexOf(s.id) >= 0; }).length;
        return '<a class="card dark" href="#/skill/' + s.id + '" style="border-left-color:#d1a437"><div class="meta">' + n + ' lessons</div><h3>' + esc(s.name) + '</h3><p>' + esc(s.blurb) + '</p></a>';
      }).join('') +
      '<a class="card dark" href="#/lab/grooves" style="border-left-color:#c9483a"><div class="meta">Practice tool</div><h3>Groove Lab</h3><p>Play clave, bell patterns, tala, iqa\'at and odd meters together, and practise over them.</p></a></div></div>';
    return { html: html, title: 'Ethno-Musicology: world music for jazz players' };
  }

  function coursesView() {
    return { html: '<p class="eyebrow">' + D.lessons.length + ' lessons</p><h1 class="page">Courses</h1><p class="lede">One course per tradition, plus practice paths that mix them. Start with the jazz course if you want a refresher on the harmony the others plug into.</p><div class="course-grid">' + D.courses.map(courseCard).join('') + '</div>', title: 'Courses: Ethno-Musicology' };
  }

  function courseView(cid) {
    var c = COURSE[cid]; if (!c) return notFound();
    var list = lessonsOf(cid), i = D.courses.indexOf(c), next = D.courses[i + 1];
    var html = '<div class="crumbs"><a href="#/courses">Courses</a> › ' + esc(c.name) + '</div><p class="eyebrow">' + esc(c.region) + '</p><h1 class="page">' + cdot(cid) + esc(c.name) + '</h1><p class="lede">' + esc(c.blurb) + '</p>' +
      '<ol class="lesson-list">' + list.map(function (L) {
        return '<li><a href="#/lesson/' + L.id + '"><span class="lt">' + esc(L.title) + '</span><span class="ls">' + esc(L.summary) + '</span><span class="lk">' + L.skills.map(function (s) { return esc(SKILL[s].name); }).join(' · ') + '</span></a></li>';
      }).join('') + '</ol>' +
      (next ? '<div class="pager"><a class="card dark" href="#/course/' + next.id + '" style="border-left-color:' + next.color + '"><div class="meta">next course →</div><h3>' + esc(next.name) + '</h3></a></div>' : '');
    return { html: html, title: c.name + ': Ethno-Musicology' };
  }

  function select(id, label, opts, cur) {
    return '<label class="ctl"><span>' + label + '</span><select id="' + id + '">' + opts.map(function (o) {
      return '<option value="' + o[1] + '"' + (o[1] === cur ? ' selected' : '') + '>' + esc(o[0]) + '</option>';
    }).join('') + '</select></label>';
  }

  function lessonView(lid) {
    var L = LESSON[lid]; if (!L) return notFound();
    var c = COURSE[L.course], list = lessonsOf(L.course), i = list.indexOf(L);
    var prev = list[i - 1], next = list[i + 1] || D.lessons[L.n + 1];
    var transposable = L.learn.concat(L.jazz).some(function (b) { return b.transpose; });
    var done = store('done.' + lid) || [];
    var html = '<div class="crumbs"><a href="#/courses">Courses</a> › <a href="#/course/' + c.id + '">' + esc(c.name) + '</a> › lesson ' + (i + 1) + ' of ' + list.length + '</div>' +
      '<div class="lesson-head"><h1>' + esc(L.title) + '</h1><p class="sum">' + esc(L.summary) + '</p><div class="chips">' + skillChips(L) + '</div></div>' +
      '<div class="toolbar" id="tools">' +
      (transposable ? select('t-key', 'Key', KEYS, settings.key) + select('t-instr', 'Instrument', INSTR, settings.instr) : '<span class="tnote">This lesson is in exact tuning or rhythm only, so it stays in its written key.</span>') +
      select('t-tempo', 'Tempo', TEMPO, settings.tempo) + '</div>' +
      (transposable ? '<p class="tnote" id="t-note" hidden></p>' : '') +
      '<section class="lsec"><h2>Background</h2><p class="bg">' + esc(L.background) + '</p></section>' +
      '<section class="lsec play"><h2>Learn it</h2><div id="learn"></div></section>' +
      '<section class="lsec play jazz"><h2>Use it in jazz</h2><div id="jazz"></div></section>' +
      '<section class="lsec"><h2>Practice plan</h2><ul class="practice" id="practice">' + L.practice.map(function (p, k) {
        return '<li><label><input type="checkbox" data-k="' + k + '"' + (done.indexOf(k) >= 0 ? ' checked' : '') + '><span>' + window.Play.md(p) + '</span></label></li>';
      }).join('') + '</ul></section>' +
      (L.listen.length ? '<section class="lsec"><h2>Listen</h2><ul class="listen">' + L.listen.map(function (x) { return '<li>' + esc(x) + '</li>'; }).join('') + '</ul></section>' : '') +
      '<p class="sources">The musicology behind this lesson, in the atlas: ' + L.kb.map(function (k, j) { return '<a href="' + ATLAS_PAGE + '#/e/' + k + '">' + esc(L.sources[j]) + '</a>'; }).join('; ') + '.</p>' +
      '<div class="pager">' + (prev ? '<a class="card dark" href="#/lesson/' + prev.id + '" style="border-left-color:' + c.color + '"><div class="meta">← previous lesson</div><h3>' + esc(prev.title) + '</h3></a>' : '') +
      (next ? '<a class="card dark" href="#/lesson/' + next.id + '" style="border-left-color:' + col(next.course) + '"><div class="meta">next' + (next.course !== L.course ? ': ' + esc(COURSE[next.course].name) : ' lesson') + ' →</div><h3>' + esc(next.title) + '</h3></a>' : '') + '</div>';
    return { html: html, title: L.title + ': Ethno-Musicology', after: function () {
      function draw() {
        window.Labs.stop();
        var opt = { key: settings.key, instr: settings.instr, tempo: settings.tempo };
        window.Play.renderBlocks(document.getElementById('learn'), L.learn, opt);
        window.Play.renderBlocks(document.getElementById('jazz'), L.jazz, opt);
        var n = document.getElementById('t-note');
        if (n) {
          n.hidden = !(settings.key || settings.instr);
          n.textContent = 'Words above the staff (scale and chord-function names) describe the original key of C.' +
            (settings.key && L.learn.concat(L.jazz).some(function (b) { return b.type === 'chords'; }) ? ' ' + window.Play.slideHint(settings.key) : '');
        }
      }
      draw();
      document.getElementById('tools').addEventListener('change', function (e) {
        var k = { 't-key': 'key', 't-instr': 'instr', 't-tempo': 'tempo' }[e.target.id]; if (!k) return;
        settings[k] = Number(e.target.value); store('settings', settings); draw();
      });
      document.getElementById('practice').addEventListener('change', function () {
        var ks = []; view.querySelectorAll('#practice input:checked').forEach(function (x) { ks.push(+x.dataset.k); });
        store('done.' + lid, ks);
      });
    } };
  }

  function skillsView() {
    var html = '<p class="eyebrow">Across every tradition</p><h1 class="page">By skill</h1><p class="lede">The same lessons, grouped by what they train.</p>';
    D.skills.forEach(function (s) { html += skillSection(s, true); });
    return { html: html, title: 'By skill: Ethno-Musicology' };
  }
  function skillSection(s, link) {
    var list = D.lessons.filter(function (L) { return L.skills.indexOf(s.id) >= 0; });
    return '<section class="sec"><h2>' + (link ? '<a href="#/skill/' + s.id + '" class="plain">' + esc(s.name) + '</a>' : esc(s.name)) + '</h2><p class="intro">' + esc(s.blurb) + ' ' + list.length + ' lessons.</p><div class="grid">' + list.map(function (L) { return lessonCard(L); }).join('') + '</div></section>';
  }
  function skillView(sid) {
    var s = SKILL[sid]; if (!s) return notFound();
    return { html: '<div class="crumbs"><a href="#/skills">By skill</a></div><p class="eyebrow">Skill</p><h1 class="page">' + esc(s.name) + '</h1>' + skillSection(s, false), title: s.name + ': Ethno-Musicology' };
  }

  function labView(qs) {
    return { html: '<div id="labroot"></div>', title: 'Groove Lab: Ethno-Musicology', after: function () {
      window.Labs.grooves(document.getElementById('labroot'), qs);
    } };
  }

  function notFound() { return { html: '<h1 class="page">Not found</h1><p class="lede">That page isn’t in the course. <a href="#/">Back to the start.</a></p>', title: 'Not found: Ethno-Musicology' }; }

  /* ---------------- router ---------------- */
  function parseQS(s) { var o = {}; (s || '').split('&').forEach(function (p) { var i = p.indexOf('='); if (i > 0) o[p.slice(0, i)] = decodeURIComponent(p.slice(i + 1)); }); return o; }
  function route() {
    window.Labs.stop();
    var h = location.hash || '#/', q = '', qi = h.indexOf('?');
    if (qi > 0) { q = h.slice(qi + 1); h = h.slice(0, qi); }
    var parts = h.replace(/^#\//, '').split('/'), r;
    // atlas routes belong to the Musicology section
    if (['e', 'facet', 'cultures', 'culture', 'threads', 'thread', 'connections'].indexOf(parts[0]) >= 0 || (parts[0] === 'lab' && parts[1] !== 'grooves')) { location.replace(ATLAS_PAGE + location.hash); return; }
    switch (parts[0]) {
      case '': r = home(); break;
      case 'courses': r = coursesView(); break;
      case 'course': r = courseView(parts[1]); break;
      case 'lesson': r = lessonView(parts[1]); break;
      case 'skills': r = skillsView(); break;
      case 'skill': r = skillView(parts[1]); break;
      case 'lab': r = labView(parseQS(q)); break;
      default: r = notFound();
    }
    view.innerHTML = r.html;
    document.title = r.title;
    if (r.after) r.after();
    var navOn = { courses: 'courses', course: parts[1] === 'cross' ? 'cross' : 'courses', lesson: LESSON[parts[1]] && LESSON[parts[1]].course === 'cross' ? 'cross' : 'courses', skills: 'skills', skill: 'skills', lab: 'lab' }[parts[0]];
    document.querySelectorAll('#nav a').forEach(function (a) { a.classList.toggle('on', a.dataset.nav === navOn); });
    if (!window.__first) window.scrollTo(0, 0);
    window.__first = false;
    rs.hidden = true;
  }
  window.__first = true;
  window.addEventListener('hashchange', route);

  /* ---------------- search ---------------- */
  var idx = null;
  function blockText(b) { return [b.title || '', b.caption || '', b.text || '', (b.items || []).join(' '), (b.chords || []).map(function (c) { return c.name; }).join(' ')].join(' '); }
  function buildIdx() {
    idx = D.lessons.map(function (L) {
      var body = [L.summary, L.background, COURSE[L.course].name, L.practice.join(' '), L.listen.join(' ')].concat(L.learn.concat(L.jazz).map(blockText)).join(' ').replace(/\*\*|\*/g, '');
      return { id: L.id, title: L.title.toLowerCase(), sum: L.summary.toLowerCase(), body: body, low: body.toLowerCase() };
    });
  }
  var q = document.getElementById('q'), rs = document.getElementById('results');
  function doSearch() {
    var s = q.value.trim().toLowerCase();
    if (s.length < 2) { rs.hidden = true; return; }
    if (!idx) buildIdx();
    var toks = s.split(/\s+/), out = [];
    idx.forEach(function (x) {
      var sc = 0, ok = true, first = -1;
      toks.forEach(function (t) {
        var inT = x.title.indexOf(t) >= 0, inS = x.sum.indexOf(t) >= 0, p = x.low.indexOf(t);
        if (!inT && !inS && p < 0) ok = false;
        sc += (inT ? 6 : 0) + (inS ? 3 : 0) + (p >= 0 ? 1 : 0);
        if (p >= 0 && first < 0) first = p;
      });
      if (ok) out.push({ x: x, sc: sc, first: first });
    });
    out.sort(function (a, b) { return b.sc - a.sc; });
    rs.hidden = false;
    rs.innerHTML = out.length ? out.slice(0, 12).map(function (o) {
      var L = LESSON[o.x.id];
      var sn = o.first >= 0 ? '…' + o.x.body.substr(Math.max(0, o.first - 50), 130) + '…' : L.summary;
      return '<a href="#/lesson/' + L.id + '"><div class="rt">' + cdot(L.course) + esc(L.title) + '</div><div class="rs">' + esc(sn) + '</div></a>';
    }).join('') : '<div class="none">No lessons match “' + esc(q.value) + '”.</div>';
  }
  q.addEventListener('input', doSearch);
  q.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') { rs.hidden = true; q.blur(); }
    if (e.key === 'Enter') { var a = rs.querySelector('a'); if (a) { location.hash = a.getAttribute('href'); q.value = ''; rs.hidden = true; } }
  });
  document.addEventListener('click', function (e) { if (!e.target.closest('.search')) rs.hidden = true; });
  rs.addEventListener('click', function () { q.value = ''; });

  document.getElementById('stats').textContent = D.lessons.length + ' lessons in ' + D.courses.length + ' courses.';
  route();
})();

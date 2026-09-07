# shankFiddle — Website

Personal site for Shankar Srinivasan (shankFiddle) — musician, philosopher,
artist. Single-page site (Hero / About / Tools / Contact) plus four
interactive sub-pages pulled in from their own standalone repos.

## Structure

```
index.html                   Home page (hero, about, tools grid, contact)
css/styles.css                Shared site styling — dark/gold/magenta theme
js/main.js                    Mobile nav toggle
assets/images/                Logo + brand photography
tools/circle-of-fifths/
  index.html                  shankFiddle-branded wrapper (top bar + iframe)
  app.html                     NOT a plain copy — see note below
tools/synth/
  index.html                  Wrapper
  app.html                     Unmodified copy of modular-synth-widget/index.html
tools/fractal/
  index.html                  Wrapper
  app.html                     Unmodified copy of fractal-widget/index.html
tools/boy/
  index.html                  Wrapper
  app.html                     Unmodified copy of boy-game/index.html
```

Each tool lives in an iframe (`app.html`) inside a small shankFiddle-branded
wrapper page (`index.html`) — a thin top bar with a "← shankFiddle" link
back to the home page's Tools section, the tool's name, and a "Full
screen ↗" link that opens `app.html` directly with no iframe/chrome
around it. For fractal/synth/boy, `app.html` is an untouched copy
straight from the tool's own repo — to pull in updates, just re-copy
the file:

```bash
cp ~/fractal-widget/index.html tools/fractal/app.html
cp ~/modular-synth-widget/index.html tools/synth/app.html
cp ~/boy-game/index.html tools/boy/app.html
```

**circle-of-fifths/app.html is the one exception — do not blindly
`cp` over it.** It carries shankFiddle/Boy-game-specific patches on top
of the standalone `circle-of-fifths-chord-wheel.html`: a "practicing
for" teacher/instrument selector (`#teacherSelect`) and `sendBoyGoal()`
calls at several interaction points, which `postMessage` progress back
to a parent page embedding this tool (the Boy game). Overwriting
`app.html` with a plain copy of the upstream file would silently delete
that integration. To pull in an update, diff the upstream file against
`app.html` first (e.g. `diff ~/circle-of-fifths-chord-wheel/circle-of-fifths-chord-wheel.html tools/circle-of-fifths/app.html`) and hand-merge just the
new changes, keeping every `instrument-row`/`sendBoyGoal`/`teacherSelect`
line intact.

No need to touch the wrapper `index.html` files when a tool updates —
they never change.

## Run locally

```bash
cd shankfiddle-site
python3 -m http.server 8420
# open http://localhost:8420
```

## Palette

Colors are drawn from the shankFiddle logo (gold treble clef, magenta neon
glow, on black) — see `:root` in `css/styles.css`.

## To do

- [ ] Replace placeholder bio text in the About section with your real story
- [ ] Add real contact email and social links (Instagram, Bandcamp, YouTube)
- [ ] Consider adding Music and Writing sections once there's content for them
- [ ] Swap the About portrait image for something more deliberate than the light-painting photo, if desired
- [ ] When ready, create a GitHub repo (e.g. `shankardba/shankfiddle-site`) and push

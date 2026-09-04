# shankFiddle — Website

Personal site for Shankar Srinivasan (shankFiddle) — musician, philosopher,
artist. Single-page site (Hero / About / Tools / Contact) plus three
interactive sub-pages pulled in from their own standalone repos.

## Structure

```
index.html                   Home page (hero, about, tools grid, contact)
css/styles.css                Shared site styling — dark/gold/magenta theme
js/main.js                    Mobile nav toggle
assets/images/                Logo + brand photography
tools/circle-of-fifths/       Copy of circle-of-fifths-chord-wheel.html
tools/synth/                  Copy of modular-synth-widget/index.html
tools/fractal/                Copy of fractal-widget/index.html
```

Each tool page is a straight copy of its source repo's HTML file with one
addition: a small "← shankFiddle" link back to the home page's Tools
section, styled to match that tool's own UI. Everything else in those
files is untouched — if you improve a tool, edit it in its own repo
(`~/fractal-widget`, `~/modular-synth-widget`,
`~/circle-of-fifths-chord-wheel`) and re-copy the file here, re-adding the
back-link if it's not preserved by your edit.

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

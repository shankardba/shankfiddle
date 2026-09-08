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
  app.html                     Unmodified copy of claude-applets/modular-synth-widget/index.html
tools/fractal/
  index.html                  Wrapper
  app.html                     Unmodified copy of claude-applets/fractal-widget/index.html
tools/flute-circle-of-fifths/
  index.html                  Wrapper
  app.html                     Unmodified copy of claude-applets/flute-circle-of-fifths/index.html
tools/boy/
  index.html                  Wrapper
  app.html                     Unmodified copy of boy-game/index.html
tools/spirograph/
  index.html                  Wrapper
  app.html                     Canonical source — mirrored OUT to the private
                                spirograph-studio repo, not copied in from it
```

Each tool lives in an iframe (`app.html`) inside a small shankFiddle-branded
wrapper page (`index.html`) — a thin top bar with a "← shankFiddle" link
back to the home page's Tools section, the tool's name, and a "Full
screen ↗" link that opens `app.html` directly with no iframe/chrome
around it. For fractal/synth/boy, `app.html` is an untouched copy
straight from the tool's own repo — to pull in updates, just re-copy
the file:

```bash
cp ~/claude-applets/fractal-widget/index.html tools/fractal/app.html
cp ~/claude-applets/modular-synth-widget/index.html tools/synth/app.html
cp ~/claude-applets/flute-circle-of-fifths/index.html tools/flute-circle-of-fifths/app.html
cp ~/boy-game/index.html tools/boy/app.html
```

**circle-of-fifths/app.html is the one exception — do not blindly
`cp` over it.** It carries shankFiddle/Boy-game-specific patches on top
of the standalone `circle-of-fifths-chord-wheel.html`: a `?teacher=`
query-param read (which teacher's dialogue linked here — piano, guitar,
or the default theory) and `sendBoyGoal()` calls at several interaction
points, which `postMessage` progress back to a parent page embedding
this tool (the Boy game). Overwriting `app.html` with a plain copy of
the upstream file would silently delete that integration. To pull in an
update, diff the upstream file against `app.html` first (e.g. `diff
~/circle-of-fifths-chord-wheel/circle-of-fifths-chord-wheel.html
tools/circle-of-fifths/app.html`) and hand-merge just the new changes,
keeping every `currentTeacher`/`sendBoyGoal` line intact.

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

## Spirograph Studio

`tools/spirograph/` follows the same wrapper+iframe pattern as the tools
above, but the sync direction is reversed from all of them: `app.html` here
is the **canonical source** — edited directly in place — and the private
`spirograph-studio` repo (cloned locally at
`~/claude-applets/spirograph-studio`) is kept as a mirror of it, not the
other way around. After editing `tools/spirograph/app.html`, push the change
out to the private repo instead of pulling one in:

```bash
cp tools/spirograph/app.html ~/claude-applets/spirograph-studio/index.html
cd ~/claude-applets/spirograph-studio
git add index.html && git commit -m "..." && git push
```

## Sandbox: Stock Sonifier

`sandbox/stock-sonifier/` follows the same wrapper+iframe pattern as `tools/`,
just with a few extra files instead of a single `app.html`:

```
sandbox/stock-sonifier/
  index.html                  Wrapper
  app.html                     Unmodified copy of claude-applets/stock-sonifier-widget/index.html
  css/styles.css                Unmodified copy of the same repo's css/styles.css
  js/                          Unmodified copy of the same repo's js/*.js
```

To pull in updates:

```bash
cp ~/claude-applets/stock-sonifier-widget/index.html sandbox/stock-sonifier/app.html
cp ~/claude-applets/stock-sonifier-widget/css/styles.css sandbox/stock-sonifier/css/styles.css
cp ~/claude-applets/stock-sonifier-widget/js/*.js sandbox/stock-sonifier/js/
```

It also depends on a companion Cloudflare Worker
(`~/claude-applets/stock-sonifier-worker`) that proxies and caches Twelve
Data so the API key stays server-side. `js/data.js` in both copies points at
the deployed Worker (`stock-sonifier-proxy.shankfiddle.workers.dev`) unless
the page is running on `localhost`, in which case it talks to `wrangler dev`
on port 8787 instead — no manual toggle needed between the two.

## Sandbox: Overtone Series

`sandbox/overtones/` follows the same wrapper+iframe pattern as `tools/`:

```
sandbox/overtones/
  index.html                  Wrapper
  app.html                     Unmodified copy of claude-applets/overtone-series/index.html
```

To pull in updates:

```bash
cp ~/claude-applets/overtone-series/index.html sandbox/overtones/app.html
```

## To do

- [ ] Replace placeholder bio text in the About section with your real story
- [ ] Add real contact email and social links (Instagram, Bandcamp, YouTube)
- [ ] Consider adding Music and Writing sections once there's content for them
- [ ] Swap the About portrait image for something more deliberate than the light-painting photo, if desired
- [ ] When ready, create a GitHub repo (e.g. `shankardba/shankfiddle-site`) and push

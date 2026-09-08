// Data layer: fetch + cache daily OHLCV bars via the stock-sonifier-proxy Worker
// (a thin caching proxy over Twelve Data — see ~/stock-sonifier-worker). The proxy
// keeps the real API key server-side and edge-caches responses so the shared free
// quota (800 req/day) stretches across every visitor, not per-browser.
(function () {
  // Local dev (python http.server / wrangler dev) talks to the local Worker; any
  // other host (the deployed site) talks to the real deployed Worker.
  const IS_LOCAL = ['localhost', '127.0.0.1'].includes(location.hostname);
  const API_BASE = IS_LOCAL ? 'http://localhost:8787' : 'https://stock-sonifier-proxy.shankfiddle.workers.dev';

  const CACHE_PREFIX = 'stocksonifier:v1:';
  const CACHE_TTL_MS = 4 * 60 * 60 * 1000; // 4h, matches the Worker's edge cache TTL

  function cacheKey(symbol, range) {
    return `${CACHE_PREFIX}${symbol.toUpperCase()}:${range}`;
  }

  function readCache(symbol, range) {
    try {
      const raw = localStorage.getItem(cacheKey(symbol, range));
      if (!raw) return null;
      const entry = JSON.parse(raw);
      if (Date.now() - entry.fetchedAt > CACHE_TTL_MS) return null;
      return entry.bars;
    } catch {
      return null;
    }
  }

  function writeCache(symbol, range, bars) {
    try {
      localStorage.setItem(cacheKey(symbol, range), JSON.stringify({ fetchedAt: Date.now(), bars }));
    } catch {
      // storage full or unavailable (private browsing) — non-fatal, just skip caching
    }
  }

  // range is passed straight through to the Worker, which maps it to a Twelve Data
  // outputsize. Valid values: 1m, 3m, 6m, ytd, 1y, 5y, 10y, max.
  async function fetchBars(symbol, range = 'max', { force = false } = {}) {
    const sym = symbol.trim().toUpperCase();
    if (!sym) throw new Error('Enter a ticker symbol.');

    const cached = !force ? readCache(sym, range) : null;
    if (cached) return { bars: cached, fromCache: true };

    const url = `${API_BASE}/bars?symbol=${encodeURIComponent(sym)}&range=${encodeURIComponent(range)}`;
    let res;
    try {
      res = await fetch(url);
    } catch {
      throw new Error('Could not reach the data proxy — is it running/deployed?');
    }
    const data = await res.json().catch(() => null);
    if (!res.ok || !data || data.error) {
      throw new Error((data && data.error) || `Request failed (${res.status})`);
    }
    writeCache(sym, range, data.bars);
    return { bars: data.bars, fromCache: false };
  }

  window.StockData = { fetchBars };
})();

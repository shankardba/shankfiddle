// Canvas price chart. Two render modes: 'line' (default — glowing gradient area,
// the modern/fintech hero view) and 'candles' (traditional OHLC, for detail).
// Long ranges are downsampled with OHLC-preserving bucket aggregation so a 20-year
// "max" view still has an accurate high/low shape instead of just dropping points.
(function () {
  function downsampleOHLC(bars, maxBuckets) {
    if (bars.length <= maxBuckets) return bars.map((b, i) => ({ ...b, sourceStart: i, sourceEnd: i }));
    const bucketSize = Math.ceil(bars.length / maxBuckets);
    const out = [];
    for (let i = 0; i < bars.length; i += bucketSize) {
      const slice = bars.slice(i, i + bucketSize);
      let high = -Infinity, low = Infinity, volume = 0;
      for (const b of slice) {
        if (b.high > high) high = b.high;
        if (b.low < low) low = b.low;
        volume += b.volume;
      }
      out.push({
        date: slice[0].date,
        t: slice[0].t,
        open: slice[0].open,
        close: slice[slice.length - 1].close,
        high,
        low,
        volume,
        sourceStart: i,
        sourceEnd: Math.min(i + bucketSize, bars.length) - 1,
      });
    }
    return out;
  }

  class StockChart {
    constructor(canvas, opts = {}) {
      this.canvas = canvas;
      this.ctx = canvas.getContext('2d');
      this.upColor = opts.upColor || '#f0a83c';
      this.downColor = opts.downColor || '#ff2ea6';
      this.mode = opts.mode || 'line';
      this.bars = [];
      this.displayBars = [];
      this.hoverIndex = null;
      this.playheadIndex = null;
      this.loopWindow = null; // { startFrac, stopFrac } in [0,1] of the full series
      this.onHover = typeof opts.onHover === 'function' ? opts.onHover : null;
      this.onRecompute = typeof opts.onRecompute === 'function' ? opts.onRecompute : null;
      this._ro = new ResizeObserver(() => this.resize());
      this._ro.observe(canvas.parentElement);
      this._bindEvents();
      this.resize();
    }

    setMode(mode) {
      this.mode = mode;
      this.draw();
    }

    setData(bars) {
      this.bars = bars;
      this._recompute();
      this.draw();
    }

    _recompute() {
      const width = Math.max(1, this.canvas.clientWidth);
      const maxBuckets = Math.max(20, Math.floor(width / 4));
      this.displayBars = downsampleOHLC(this.bars, maxBuckets);
      if (this.onRecompute) this.onRecompute(this.displayBars);
    }

    resize() {
      const dpr = window.devicePixelRatio || 1;
      const rect = this.canvas.parentElement.getBoundingClientRect();
      const w = Math.max(1, Math.floor(rect.width));
      const h = Math.max(1, Math.floor(rect.height));
      this.canvas.width = w * dpr;
      this.canvas.height = h * dpr;
      this.canvas.style.width = w + 'px';
      this.canvas.style.height = h + 'px';
      this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      this._recompute();
      this.draw();
    }

    _bindEvents() {
      this.canvas.addEventListener('mousemove', (e) => {
        const rect = this.canvas.getBoundingClientRect();
        const idx = this._xToIndex(e.clientX - rect.left);
        this.hoverIndex = idx;
        this.draw();
        if (this.onHover) this.onHover(idx != null ? this.displayBars[idx] : null, idx, e);
      });
      this.canvas.addEventListener('mouseleave', () => {
        this.hoverIndex = null;
        this.draw();
        if (this.onHover) this.onHover(null, null, null);
      });
    }

    _xToIndex(x) {
      const n = this.displayBars.length;
      if (!n) return null;
      const w = this.canvas.clientWidth;
      return Math.max(0, Math.min(n - 1, Math.floor((x / w) * n)));
    }

    setPlayheadIndex(idx) {
      this.playheadIndex = idx;
      this.draw();
    }

    setLoopWindow(startFrac, stopFrac) {
      this.loopWindow = startFrac == null ? null : { startFrac, stopFrac };
      this.draw();
    }

    _layout() {
      const w = this.canvas.clientWidth;
      const h = this.canvas.clientHeight;
      const padding = { top: 18, right: 6, bottom: 22, left: 6 };
      const plotW = w - padding.left - padding.right;
      const plotH = h - padding.top - padding.bottom;
      let lo = Infinity, hi = -Infinity;
      for (const b of this.displayBars) {
        if (b.low < lo) lo = b.low;
        if (b.high > hi) hi = b.high;
      }
      if (!isFinite(lo)) { lo = 0; hi = 1; }
      const range = hi - lo || 1;
      const pad = range * 0.06;
      lo -= pad;
      hi += pad;
      const yFor = (price) => padding.top + plotH - ((price - lo) / (hi - lo)) * plotH;
      const n = this.displayBars.length || 1;
      const slotW = plotW / n;
      const xFor = (i) => padding.left + slotW * (i + 0.5);
      return { w, h, padding, plotW, plotH, yFor, xFor, slotW, n };
    }

    draw() {
      const { ctx } = this;
      const w = this.canvas.clientWidth;
      const h = this.canvas.clientHeight;
      ctx.clearRect(0, 0, w, h);
      if (!this.displayBars.length) return;

      const L = this._layout();

      // minimal gridlines — a few faint horizontal guides, no axis clutter
      ctx.strokeStyle = 'rgba(240,168,60,0.07)';
      ctx.lineWidth = 1;
      for (let i = 0; i <= 3; i++) {
        const y = L.padding.top + (L.plotH / 3) * i;
        ctx.beginPath();
        ctx.moveTo(L.padding.left, y);
        ctx.lineTo(w - L.padding.right, y);
        ctx.stroke();
      }

      if (this.loopWindow) this._drawLoopWindow(L);

      if (this.mode === 'candles') this._drawCandles(L);
      else this._drawLine(L);

      if (this.playheadIndex != null) this._drawVLine(L, this.playheadIndex, 'rgba(255,255,255,0.65)', false);
      if (this.hoverIndex != null) this._drawVLine(L, this.hoverIndex, 'rgba(247,236,233,0.35)', true);

      this._drawDateLabels(L);
    }

    _drawLoopWindow(L) {
      const { ctx } = this;
      const { startFrac, stopFrac } = this.loopWindow;
      const x0 = L.padding.left + startFrac * L.plotW;
      const x1 = L.padding.left + stopFrac * L.plotW;
      const grad = ctx.createLinearGradient(x0, 0, x1, 0);
      grad.addColorStop(0, 'rgba(255, 210, 122, 0.16)');
      grad.addColorStop(1, 'rgba(255, 46, 166, 0.16)');
      ctx.fillStyle = grad;
      ctx.fillRect(x0, L.padding.top, Math.max(1, x1 - x0), L.plotH);
      ctx.strokeStyle = 'rgba(255, 210, 122, 0.55)';
      ctx.lineWidth = 1;
      ctx.strokeRect(x0, L.padding.top, Math.max(1, x1 - x0), L.plotH);
    }

    _drawLine(L) {
      const { ctx } = this;
      const overallUp = this.displayBars[this.displayBars.length - 1].close >= this.displayBars[0].close;
      const accent = overallUp ? this.upColor : this.downColor;

      const grad = ctx.createLinearGradient(0, L.padding.top, 0, L.h - L.padding.bottom);
      grad.addColorStop(0, overallUp ? 'rgba(240,168,60,0.30)' : 'rgba(255,46,166,0.30)');
      grad.addColorStop(1, overallUp ? 'rgba(240,168,60,0)' : 'rgba(255,46,166,0)');

      ctx.beginPath();
      this.displayBars.forEach((b, i) => {
        const x = L.xFor(i);
        const y = L.yFor(b.close);
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      });
      ctx.lineTo(L.xFor(L.n - 1), L.h - L.padding.bottom);
      ctx.lineTo(L.xFor(0), L.h - L.padding.bottom);
      ctx.closePath();
      ctx.fillStyle = grad;
      ctx.fill();

      ctx.beginPath();
      this.displayBars.forEach((b, i) => {
        const x = L.xFor(i);
        const y = L.yFor(b.close);
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      });
      ctx.strokeStyle = accent;
      ctx.lineWidth = 2;
      ctx.shadowColor = accent;
      ctx.shadowBlur = 10;
      ctx.stroke();
      ctx.shadowBlur = 0;

      // glowing dot at the latest point
      const last = this.displayBars.length - 1;
      const x = L.xFor(last);
      const y = L.yFor(this.displayBars[last].close);
      ctx.beginPath();
      ctx.arc(x, y, 3.5, 0, Math.PI * 2);
      ctx.fillStyle = accent;
      ctx.shadowColor = accent;
      ctx.shadowBlur = 12;
      ctx.fill();
      ctx.shadowBlur = 0;
    }

    _drawCandles(L) {
      const { ctx } = this;
      const bodyW = Math.max(1.5, L.slotW * 0.62);
      this.displayBars.forEach((b, i) => {
        const x = L.xFor(i);
        const up = b.close >= b.open;
        const color = up ? this.upColor : this.downColor;
        ctx.strokeStyle = color;
        ctx.fillStyle = color;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(x, L.yFor(b.high));
        ctx.lineTo(x, L.yFor(b.low));
        ctx.stroke();
        const yOpen = L.yFor(b.open);
        const yClose = L.yFor(b.close);
        const top = Math.min(yOpen, yClose);
        const bh = Math.max(1, Math.abs(yClose - yOpen));
        ctx.fillRect(x - bodyW / 2, top, bodyW, bh);
      });
    }

    _drawVLine(L, idx, color, dashed) {
      const { ctx } = this;
      const x = L.xFor(idx);
      ctx.strokeStyle = color;
      ctx.lineWidth = 1;
      if (dashed) ctx.setLineDash([3, 3]);
      ctx.beginPath();
      ctx.moveTo(x, L.padding.top);
      ctx.lineTo(x, L.h - L.padding.bottom);
      ctx.stroke();
      if (dashed) ctx.setLineDash([]);
    }

    _drawDateLabels(L) {
      const { ctx } = this;
      ctx.fillStyle = 'rgba(199,171,184,0.65)';
      ctx.font = '10.5px Inter, system-ui, sans-serif';
      ctx.textAlign = 'center';
      const count = Math.min(5, L.n);
      if (count < 2) return;
      for (let i = 0; i < count; i++) {
        const idx = Math.round((i / (count - 1)) * (L.n - 1));
        const b = this.displayBars[idx];
        ctx.fillText(b.date, L.xFor(idx), L.h - 6);
      }
    }
  }

  window.StockChart = StockChart;
})();

/**
 * ===================================================================
 * TELEGRAM MINI APP (TMA) - PHÙ THỦY ĐẦU TƯ VALUATION DASHBOARD
 * Core Logic & Data Engine
 * ===================================================================
 */

(() => {
  // Telegram WebApp SDK Reference
  const tg = window.Telegram && window.Telegram.WebApp ? window.Telegram.WebApp : null;

  // Initialize Telegram WebApp UI settings
  if (tg) {
    tg.ready();
    tg.expand(); // Open full screen in Telegram
  }

  // Storage Keys & API Endpoint Default
  const STORAGE_KEYS = {
    API_URL: 'dinhgia_api_url',
    CACHE: 'tma_valuation_cache',
    WATCHLIST: 'tma_watchlist'
  };

  // Google Apps Script API Web App URL
  const DEFAULT_API_URL = "https://script.google.com/macros/s/AKfycbxDu0RPZNi4H2G6Z6FhEtf9r9Rwa43Nvdh5PDcRJEV--j6vyP-u3boivHiShJcd395nuw/exec";

  // Fallback Sample Data (30+ representative VN stocks)
  const SAMPLE_STOCKS = [
    {
      ticker: "HPG", name: "Tập đoàn Hòa Phát", nganh: "Thép - Vật liệu", von: "LARGE",
      price: 29800, eps: 2650, bvps: 20500, pe: 11.2, pb: 1.45, roe: 16.5,
      fvPE: 37500, fvPB: 32800, fvGraham: 35000, fairValue: 36600, upside: 22.82,
      valuationLevel: "UNDERVALUED", valuationLabel: "Định giá Rẻ", valuationIcon: "🟢",
      recommendation: "Hấp dẫn: Giá đang chiết khấu tốt so với giá trị thực (Upside 22.8%)"
    },
    {
      ticker: "MBB", name: "Ngân hàng TMCP Quân Đội", nganh: "Ngân hàng", von: "LARGE",
      price: 25400, eps: 3850, bvps: 23200, pe: 6.6, pb: 1.09, roe: 23.4,
      fvPE: 36500, fvPB: 41700, fvGraham: 44800, fairValue: 38500, upside: 51.57,
      valuationLevel: "EXTREMELY_UNDERVALUED", valuationLabel: "Định giá Siêu Rẻ", valuationIcon: "💎🟢",
      recommendation: "Cơ hội vàng: Biên an toàn rất lớn (Upside > 50%), P/B thấp so với ROE 23%"
    },
    {
      ticker: "TCB", name: "Ngân hàng Techcombank", nganh: "Ngân hàng", von: "LARGE",
      price: 24800, eps: 3200, bvps: 24100, pe: 7.75, pb: 1.03, roe: 17.8,
      fvPE: 33500, fvPB: 36000, fvGraham: 37000, fairValue: 35500, upside: 43.15,
      valuationLevel: "EXTREMELY_UNDERVALUED", valuationLabel: "Định giá Siêu Rẻ", valuationIcon: "💎🟢",
      recommendation: "Biên an toàn tốt (Upside 43.1%), định giá P/B quanh 1.0x hợp lý tích lũy dài hạn"
    },
    {
      ticker: "FPT", name: "Tập đoàn FPT", nganh: "Công nghệ thông tin", von: "LARGE",
      price: 135000, eps: 5800, bvps: 28500, pe: 23.2, pb: 4.73, roe: 27.5,
      fvPE: 142000, fvPB: 138000, fvGraham: 120000, fairValue: 139000, upside: 2.96,
      valuationLevel: "FAIR", valuationLabel: "Định giá Hợp Lý", valuationIcon: "🟡",
      recommendation: "Định giá phù hợp với đà tăng trưởng 20-25%/năm. Ưu tiên canh nhịp chỉnh."
    },
    {
      ticker: "VHM", name: "Vinhomes", nganh: "Bất động sản", von: "LARGE",
      price: 43200, eps: 6400, bvps: 45000, pe: 6.75, pb: 0.96, roe: 18.2,
      fvPE: 62000, fvPB: 67500, fvGraham: 71000, fairValue: 66000, upside: 52.78,
      valuationLevel: "EXTREMELY_UNDERVALUED", valuationLabel: "Định giá Siêu Rẻ", valuationIcon: "💎🟢",
      recommendation: "Chiết khấu sâu so với tài sản quỹ đất. Upside tiềm năng 52.7%"
    },
    {
      ticker: "SSI", name: "Chứng khoán SSI", nganh: "Chứng khoán", von: "LARGE",
      price: 34500, eps: 1850, bvps: 18200, pe: 18.6, pb: 1.89, roe: 13.5,
      fvPE: 33000, fvPB: 32500, fvGraham: 28000, fairValue: 31500, upside: -8.70,
      valuationLevel: "OVERVALUED", valuationLabel: "Định giá Đắt", valuationIcon: "🔴",
      recommendation: "Giá hiện tại đã phản ánh phần lớn kỳ vọngKRX & nâng hạng. Thận trọng mua đuổi."
    }
  ];

  // State Management
  let allStocks = [];
  let currentFilter = 'ALL';
  let currentNganh = 'ALL';
  let currentSort = 'upside_desc';
  let searchQuery = '';
  let watchlist = new Set(JSON.parse(localStorage.getItem(STORAGE_KEYS.WATCHLIST) || '[]'));

  // DOM Elements
  const elStockList = document.getElementById('stockList');
  const elLoading = document.getElementById('loadingState');
  const elEmpty = document.getElementById('emptyState');
  const elSearchInput = document.getElementById('searchInput');
  const elBtnClearSearch = document.getElementById('btnClearSearch');
  const elSelectNganh = document.getElementById('selectNganh');
  const elSelectSort = document.getElementById('selectSort');
  const elBtnRefresh = document.getElementById('btnRefresh');

  // Modal Elements
  const elModal = document.getElementById('detailModal');
  const elBtnCloseModal = document.getElementById('btnCloseModal');
  const elBtnStarModal = document.getElementById('btnStarModal');
  let selectedStock = null;

  // Trigger Haptic Feedback in Telegram
  function triggerHaptic(type = 'light') {
    if (tg && tg.HapticFeedback) {
      tg.HapticFeedback.impactOccurred(type);
    }
  }

  // Format helper utilities
  function formatCurrency(val) {
    if (!val || isNaN(val)) return "0 đ";
    return new Intl.NumberFormat('vi-VN').format(Math.round(val)) + " đ";
  }

  function formatNumber(val, decimals = 1) {
    if (val === undefined || val === null || isNaN(val)) return "0";
    return Number(val).toFixed(decimals);
  }

  // Fetch Valuation Data from GAS Web App API
  async function loadData(forceRefresh = false) {
    elLoading.classList.remove('hidden');
    elStockList.innerHTML = '';
    elEmpty.classList.add('hidden');

    // Try reading cache if not forced refresh
    if (!forceRefresh) {
      const cached = localStorage.getItem(STORAGE_KEYS.CACHE);
      if (cached) {
        try {
          allStocks = JSON.parse(cached);
          renderApp();
          elLoading.classList.add('hidden');
          return;
        } catch (e) {
          console.warn("Cache parse error", e);
        }
      }
    }

    try {
      const apiUrl = `${DEFAULT_API_URL}?action=valuation${forceRefresh ? '&refresh=true' : ''}`;
      const res = await fetch(apiUrl);
      const data = await res.json();
      
      if (data && Array.isArray(data) && data.length > 0) {
        allStocks = data;
      } else if (data && data.data && Array.isArray(data.data)) {
        allStocks = data.data;
      } else {
        allStocks = SAMPLE_STOCKS;
      }

      localStorage.setItem(STORAGE_KEYS.CACHE, JSON.stringify(allStocks));
    } catch (err) {
      console.warn("API fetch error, falling back to sample data", err);
      allStocks = SAMPLE_STOCKS;
    }

    elLoading.classList.add('hidden');
    renderApp();
  }

  // Render Sectors Dropdown Options
  function populateSectors() {
    const sectors = new Set();
    allStocks.forEach(s => { if (s.nganh) sectors.add(s.nganh); });
    
    elSelectNganh.innerHTML = '<option value="ALL">Tất cả ngành</option>';
    Array.from(sectors).sort().forEach(sec => {
      const opt = document.createElement('option');
      opt.value = sec;
      opt.textContent = sec;
      elSelectNganh.appendChild(opt);
    });
  }

  // Filter & Sort Stocks
  function getFilteredStocks() {
    return allStocks.filter(stock => {
      // Search text match
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        const t = (stock.ticker || '').toLowerCase();
        const n = (stock.name || '').toLowerCase();
        if (!t.includes(q) && !n.includes(q)) return false;
      }

      // KPI Status match
      if (currentFilter === 'WATCHLIST') {
        if (!watchlist.has(stock.ticker)) return false;
      } else if (currentFilter !== 'ALL') {
        if (stock.valuationLevel !== currentFilter) return false;
      }

      // Sector match
      if (currentNganh !== 'ALL' && stock.nganh !== currentNganh) {
        return false;
      }

      return true;
    }).sort((a, b) => {
      if (currentSort === 'upside_desc') return (b.upside || 0) - (a.upside || 0);
      if (currentSort === 'upside_asc') return (a.upside || 0) - (b.upside || 0);
      if (currentSort === 'pe_asc') return (a.pe || 999) - (b.pe || 999);
      if (currentSort === 'pb_asc') return (a.pb || 999) - (b.pb || 999);
      if (currentSort === 'roe_desc') return (b.roe || 0) - (a.roe || 0);
      return 0;
    });
  }

  // Update KPI Counter Badges
  function updateKPICounts() {
    const counts = {
      ALL: allStocks.length,
      EXTREMELY_UNDERVALUED: 0,
      UNDERVALUED: 0,
      FAIR: 0,
      OVERVALUED: 0,
      WATCHLIST: watchlist.size
    };

    allStocks.forEach(s => {
      if (counts[s.valuationLevel] !== undefined) {
        counts[s.valuationLevel]++;
      }
    });

    Object.keys(counts).forEach(k => {
      const el = document.getElementById(`count${k}`);
      if (el) el.textContent = counts[k];
    });
  }

  // Render Stock Cards List
  function renderStockList() {
    const stocks = getFilteredStocks();
    elStockList.innerHTML = '';

    if (stocks.length === 0) {
      elEmpty.classList.remove('hidden');
      return;
    }
    elEmpty.classList.add('hidden');

    stocks.forEach(stock => {
      const isStarred = watchlist.has(stock.ticker);
      const isPlus = (stock.upside || 0) >= 0;
      const upsideCls = isPlus ? 'upside-plus' : 'upside-minus';
      const upsideSign = isPlus ? '+' : '';

      // Valuation level badge styling
      let badgeBg = 'rgba(255, 255, 255, 0.1)';
      let badgeColor = '#FFF';
      if (stock.valuationLevel === 'EXTREMELY_UNDERVALUED') {
        badgeBg = 'rgba(0, 230, 118, 0.15)'; badgeColor = '#00E676';
      } else if (stock.valuationLevel === 'UNDERVALUED') {
        badgeBg = 'rgba(16, 185, 129, 0.15)'; badgeColor = '#10B981';
      } else if (stock.valuationLevel === 'FAIR') {
        badgeBg = 'rgba(245, 158, 11, 0.15)'; badgeColor = '#F59E0B';
      } else if (stock.valuationLevel === 'OVERVALUED') {
        badgeBg = 'rgba(239, 68, 68, 0.15)'; badgeColor = '#EF4444';
      }

      // Range Bar percent calculation
      const fairVal = stock.fairValue || stock.price;
      const rangeRatio = Math.min(100, Math.max(10, (stock.price / fairVal) * 100));

      const card = document.createElement('div');
      card.className = 'stock-card';
      card.innerHTML = `
        <div class="stock-card-top">
          <div class="ticker-box">
            <span class="ticker-code">${stock.ticker}</span>
            <span class="sector-tag">${stock.nganh || 'N/A'}</span>
          </div>
          <button class="star-btn ${isStarred ? 'active' : ''}" data-ticker="${stock.ticker}">
            ${isStarred ? '⭐' : '☆'}
          </button>
        </div>

        <div class="stock-card-body">
          <div class="metric-col">
            <span class="lbl">Giá HT</span>
            <span class="val">${formatCurrency(stock.price)}</span>
          </div>
          <div class="metric-col">
            <span class="lbl">Fair Value</span>
            <span class="val fv">${formatCurrency(stock.fairValue)}</span>
          </div>
          <div class="metric-col">
            <span class="lbl">Biên Upside</span>
            <span class="val ${upsideCls}">${upsideSign}${formatNumber(stock.upside)}%</span>
          </div>
        </div>

        <div class="range-bar-container">
          <div class="range-bar-fill" style="width: ${rangeRatio}%; background: ${badgeColor}"></div>
        </div>

        <div class="stock-card-footer">
          <span class="val-badge" style="background: ${badgeBg}; color: ${badgeColor}">
            ${stock.valuationIcon || ''} ${stock.valuationLabel || 'N/A'}
          </span>
          <span class="pe-pb-info">
            P/E: <strong>${formatNumber(stock.pe)}</strong> | P/B: <strong>${formatNumber(stock.pb)}</strong> | ROE: <strong>${formatNumber(stock.roe)}%</strong>
          </span>
        </div>
      `;

      // Card click event -> Open modal
      card.addEventListener('click', (e) => {
        if (e.target.closest('.star-btn')) return; // Ignore star click
        triggerHaptic('light');
        openModal(stock);
      });

      // Star button toggle
      const starBtn = card.querySelector('.star-btn');
      starBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        triggerHaptic('medium');
        toggleWatchlist(stock.ticker);
      });

      elStockList.appendChild(card);
    });
  }

  // Render Full Application
  function renderApp() {
    populateSectors();
    updateKPICounts();
    renderStockList();
  }

  // Watchlist Toggle
  function toggleWatchlist(ticker) {
    if (watchlist.has(ticker)) {
      watchlist.delete(ticker);
    } else {
      watchlist.add(ticker);
    }
    localStorage.setItem(STORAGE_KEYS.WATCHLIST, JSON.stringify(Array.from(watchlist)));
    updateKPICounts();
    renderStockList();
    if (selectedStock && selectedStock.ticker === ticker) {
      updateModalStarButton();
    }
  }

  // Open Valuation Detail Modal Sheet
  function openModal(stock) {
    selectedStock = stock;
    document.getElementById('modalTicker').textContent = stock.ticker;
    document.getElementById('modalName').textContent = stock.name || stock.ticker;
    document.getElementById('modalNganh').textContent = stock.nganh || 'Thị trường VN';

    document.getElementById('modalPrice').textContent = formatCurrency(stock.price);
    document.getElementById('modalFairValue').textContent = formatCurrency(stock.fairValue);
    
    const isPlus = (stock.upside || 0) >= 0;
    const elUpside = document.getElementById('modalUpside');
    elUpside.textContent = `${isPlus ? '+' : ''}${formatNumber(stock.upside)}%`;
    elUpside.style.color = isPlus ? '#10B981' : '#EF4444';

    const elValBadge = document.getElementById('modalValBadge');
    elValBadge.textContent = `${stock.valuationIcon || ''} ${stock.valuationLabel || ''}`;
    
    document.getElementById('modalRecomText').textContent = stock.recommendation || 'Đánh giá dựa trên tích hợp 3 mô hình P/E, P/B và Graham.';

    document.getElementById('modalFvPE').textContent = formatCurrency(stock.fvPE);
    document.getElementById('modalFvPB').textContent = formatCurrency(stock.fvPB);
    document.getElementById('modalFvGraham').textContent = formatCurrency(stock.fvGraham);

    document.getElementById('modalPE').textContent = formatNumber(stock.pe);
    document.getElementById('modalPB').textContent = formatNumber(stock.pb);
    document.getElementById('modalROE').textContent = `${formatNumber(stock.roe)}%`;
    document.getElementById('modalEPS').textContent = formatNumber(stock.eps, 0);
    document.getElementById('modalBVPS').textContent = formatNumber(stock.bvps, 0);
    document.getElementById('modalVon').textContent = stock.von || 'MID';

    updateModalStarButton();
    elModal.classList.remove('hidden');
  }

  function updateModalStarButton() {
    if (!selectedStock) return;
    const isStarred = watchlist.has(selectedStock.ticker);
    document.getElementById('starIcon').textContent = isStarred ? '⭐' : '☆';
    document.getElementById('starText').textContent = isStarred ? 'Bỏ Yêu thích' : 'Thêm vào Yêu thích';
  }

  function closeModal() {
    elModal.classList.add('hidden');
    selectedStock = null;
  }

  // Event Listeners
  elSearchInput.addEventListener('input', (e) => {
    searchQuery = e.target.value.trim();
    if (searchQuery) {
      elBtnClearSearch.classList.remove('hidden');
    } else {
      elBtnClearSearch.classList.add('hidden');
    }
    renderStockList();
  });

  elBtnClearSearch.addEventListener('click', () => {
    elSearchInput.value = '';
    searchQuery = '';
    elBtnClearSearch.classList.add('hidden');
    renderStockList();
  });

  // KPI Scroll Filter Pills Click
  document.querySelectorAll('.kpi-pill').forEach(pill => {
    pill.addEventListener('click', () => {
      triggerHaptic('light');
      document.querySelectorAll('.kpi-pill').forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      currentFilter = pill.dataset.filter;
      renderStockList();
    });
  });

  elSelectNganh.addEventListener('change', (e) => {
    currentNganh = e.target.value;
    renderStockList();
  });

  elSelectSort.addEventListener('change', (e) => {
    currentSort = e.target.value;
    renderStockList();
  });

  elBtnRefresh.addEventListener('click', () => {
    triggerHaptic('medium');
    loadData(true);
  });

  elBtnCloseModal.addEventListener('click', closeModal);
  elModal.addEventListener('click', (e) => {
    if (e.target === elModal) closeModal();
  });

  elBtnStarModal.addEventListener('click', () => {
    if (selectedStock) {
      triggerHaptic('medium');
      toggleWatchlist(selectedStock.ticker);
    }
  });

  // Initial Load
  loadData();
})();

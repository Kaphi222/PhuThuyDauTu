/**
 * ===================================================================
 * TELEGRAM MINI APP (TMA) - PHÙ THỦY ĐẦU TƯ VALUATION & TECHNICAL DASHBOARD
 * Core Engine, Technical Screener & Server-Backed RBAC Access Control
 * ===================================================================
 */

(() => {
  // Telegram WebApp SDK Reference
  const tg = window.Telegram && window.Telegram.WebApp ? window.Telegram.WebApp : null;

  if (tg) {
    tg.ready();
    tg.expand();
  }

  // Extract Telegram User Info
  const tgUser = (tg && tg.initDataUnsafe && tg.initDataUnsafe.user) ? tg.initDataUnsafe.user : null;
  const currentUserId = tgUser ? tgUser.id : 'GUEST';

  const STORAGE_KEYS = {
    API_URL: 'dinhgia_api_url',
    CACHE: 'tma_valuation_cache',
    WATCHLIST: 'tma_watchlist'
  };

  const DEFAULT_API_URL = "https://script.google.com/macros/s/AKfycbxDu0RPZNi4H2G6Z6FhEtf9r9Rwa43Nvdh5PDcRJEV--j6vyP-u3boivHiShJcd395nuw/exec";

  // Sample Data with Technical Analysis Fields
  const SAMPLE_STOCKS = [
    {
      ticker: "HPG", name: "Tập đoàn Hòa Phát", nganh: "Thép - Vật liệu", von: "LARGE",
      price: 29800, eps: 2650, bvps: 20500, pe: 11.2, pb: 1.45, roe: 16.5,
      fvPE: 37500, fvPB: 32800, fvGraham: 35000, fairValue: 36600, upside: 22.82,
      valuationLevel: "UNDERVALUED", valuationLabel: "Định giá Rẻ", valuationIcon: "🟢",
      recommendation: "Hấp dẫn: Giá đang chiết khấu tốt so với giá trị thực (Upside 22.8%)",
      higherP: "1.45%", aboveP: "0.80%", macdDesc: "Xu hướng tăng mở rộng mạnh mẽ, MACD cắt lên đường Tín Hiệu.",
      smartMoneyBadge: "💎 Cá Mập Đẩy Giá", smartMoneyLabel: "Chủ động mua ròng", dvx: "+4.2k", smartMoneyDesc: "Khối lượng mua của dòng tiền lớn chiếm ưu thế vượt trội.",
      volBadge: "🔥 Bùng Nổ Vol", volPerMA50: "1.85x", maTrend: "B15 (Tăng 15 phiên)", volDesc: "Dòng tiền lan tỏa mạnh mẽ xác nhận đà bứt phá.",
      rrrBadge: "🎲 R:R = 2.8x", cung: "33,500đ (+12.4%)", cau: "28,200đ (-5.4%)", rsiBuyNeed: "+8.5%"
    },
    {
      ticker: "MBB", name: "Ngân hàng TMCP Quân Đội", nganh: "Ngân hàng", von: "LARGE",
      price: 25400, eps: 3850, bvps: 23200, pe: 6.6, pb: 1.09, roe: 23.4,
      fvPE: 36500, fvPB: 41700, fvGraham: 44800, fairValue: 38500, upside: 51.57,
      valuationLevel: "EXTREMELY_UNDERVALUED", valuationLabel: "Định giá Siêu Rẻ", valuationIcon: "💎🟢",
      recommendation: "Cơ hội vàng: Biên an toàn rất lớn (Upside > 50%), P/B thấp so với ROE 23%",
      higherP: "2.10%", aboveP: "1.20%", macdDesc: "MACD duy trì trên 0, dòng tiền tổ chức hấp thụ cung.",
      smartMoneyBadge: "💎 Khối Ngoại Mua Ròng", smartMoneyLabel: "Gom hàng tích lũy", dvx: "+8.5k", smartMoneyDesc: "Khối ngoại liên tục mua ròng ở vùng định giá thấp.",
      volBadge: "🔥 Vol Tăng Dần", volPerMA50: "1.42x", maTrend: "B22 (Tăng 22 phiên)", volDesc: "Khối lượng giao dịch tăng đều đặn.",
      rrrBadge: "🎲 R:R = 3.5x", cung: "32,000đ (+25.9%)", cau: "24,000đ (-5.5%)", rsiBuyNeed: "+12.0%"
    },
    {
      ticker: "TCB", name: "Ngân hàng Techcombank", nganh: "Ngân hàng", von: "LARGE",
      price: 24800, eps: 3200, bvps: 24100, pe: 7.75, pb: 1.03, roe: 17.8,
      fvPE: 33500, fvPB: 36000, fvGraham: 37000, fairValue: 35500, upside: 43.15,
      valuationLevel: "EXTREMELY_UNDERVALUED", valuationLabel: "Định giá Siêu Rẻ", valuationIcon: "💎🟢",
      recommendation: "Biên an toàn tốt (Upside 43.1%), định giá P/B quanh 1.0x hợp lý tích lũy dài hạn",
      higherP: "1.15%", aboveP: "0.45%", macdDesc: "Tín hiệu MACD hình thành phân kỳ dương.",
      smartMoneyBadge: "💎 Tự Doanh Mua Ròng", smartMoneyLabel: "Tích lũy nền giá", dvx: "+3.1k", smartMoneyDesc: "Lực cầu gia tăng tại vùng hỗ trợ MA50.",
      volBadge: "🟡 Vol Trung Bình", volPerMA50: "1.10x", maTrend: "B08 (Tăng 8 phiên)", volDesc: "Giao dịch tích lũy chặt chẽ.",
      rrrBadge: "🎲 R:R = 2.4x", cung: "30,000đ (+20.9%)", cau: "23,500đ (-5.2%)", rsiBuyNeed: "+6.8%"
    },
    {
      ticker: "FPT", name: "Tập đoàn FPT", nganh: "Công nghệ thông tin", von: "LARGE",
      price: 135000, eps: 5800, bvps: 28500, pe: 23.2, pb: 4.73, roe: 27.5,
      fvPE: 142000, fvPB: 138000, fvGraham: 120000, fairValue: 139000, upside: 2.96,
      valuationLevel: "FAIR", valuationLabel: "Định giá Hợp Lý", valuationIcon: "🟡",
      recommendation: "Định giá phù hợp với đà tăng trưởng 20-25%/năm. Ưu tiên canh nhịp chỉnh.",
      higherP: "0.40%", aboveP: "0.10%", macdDesc: "MACD đi ngang tích lũy đỉnh.",
      smartMoneyBadge: "🟡 Dòng Tiền Ổn Định", smartMoneyLabel: "Giữ nhịp chỉ số", dvx: "+1.2k", smartMoneyDesc: "Dòng tiền dài hạn nắm giữ.",
      volBadge: "🟡 Vol Bình Thường", volPerMA50: "0.95x", maTrend: "B05 (Tăng 5 phiên)", volDesc: "Thanh khoản duy trì ở mức cân bằng.",
      rrrBadge: "🎲 R:R = 1.2x", cung: "142,000đ (+5.1%)", cau: "128,000đ (-5.1%)", rsiBuyNeed: "+2.1%"
    },
    {
      ticker: "VHM", name: "Vinhomes", nganh: "Bất động sản", von: "LARGE",
      price: 43200, eps: 6400, bvps: 45000, pe: 6.75, pb: 0.96, roe: 18.2,
      fvPE: 62000, fvPB: 67500, fvGraham: 71000, fairValue: 66000, upside: 52.78,
      valuationLevel: "EXTREMELY_UNDERVALUED", valuationLabel: "Định giá Siêu Rẻ", valuationIcon: "💎🟢",
      recommendation: "Chiết khấu sâu so với tài sản quỹ đất. Upside tiềm năng 52.7%",
      higherP: "1.80%", aboveP: "0.90%", macdDesc: "MACD cắt lên tín hiệu đảo chiều từ đáy.",
      smartMoneyBadge: "💎 Cá Mập Bắt Đáy", smartMoneyLabel: "Mua chủ động", dvx: "+6.8k", smartMoneyDesc: "Dòng tiền lớn vào tạo đáy ngắn hạn.",
      volBadge: "🔥 Sức Bật Mạnh", volPerMA50: "1.65x", maTrend: "B12 (Tăng 12 phiên)", volDesc: "Khối lượng bùng nổ vượt trung bình.",
      rrrBadge: "🎲 R:R = 3.2x", cung: "55,000đ (+27.3%)", cau: "40,000đ (-7.4%)", rsiBuyNeed: "+15.2%"
    }
  ];

  // State Management
  let allStocks = [];
  let currentFilter = 'ALL';
  let currentNganh = 'ALL';
  let currentSort = 'upside_desc';
  let currentMacdFilter = 'ALL';
  let currentSmartMoneyFilter = 'ALL';
  let currentVolFilter = 'ALL';
  let searchQuery = '';
  let userTier = 'FREE';
  let watchlist = new Set(JSON.parse(localStorage.getItem(STORAGE_KEYS.WATCHLIST) || '[]'));

  // DOM Elements
  const elStockList = document.getElementById('stockList');
  const elLoading = document.getElementById('loadingState');
  const elEmpty = document.getElementById('emptyState');
  const elSearchInput = document.getElementById('searchInput');
  const elBtnClearSearch = document.getElementById('btnClearSearch');
  const elSelectNganh = document.getElementById('selectNganh');
  const elSelectSort = document.getElementById('selectSort');
  const elSelectMacd = document.getElementById('selectMacd');
  const elSelectSmartMoney = document.getElementById('selectSmartMoney');
  const elSelectVol = document.getElementById('selectVol');
  const elBtnRefresh = document.getElementById('btnRefresh');
  const elUserTierBadge = document.getElementById('userTierBadge');
  const elBtnAdminPanel = document.getElementById('btnAdminPanel');

  // Modal Elements
  const elModal = document.getElementById('detailModal');
  const elBtnCloseModal = document.getElementById('btnCloseModal');
  const elBtnStarModal = document.getElementById('btnStarModal');
  const elVipLockOverlay = document.getElementById('vipLockOverlay');
  const elTaUnlockedContent = document.getElementById('taUnlockedContent');
  const elVipUpgradeModal = document.getElementById('vipUpgradeModal');
  const elBtnCloseVipPrompt = document.getElementById('btnCloseVipPrompt');
  const elBtnConfirmUpgrade = document.getElementById('btnConfirmUpgrade');
  
  // Admin Modal
  const elAdminModal = document.getElementById('adminModal');
  const elBtnCloseAdminModal = document.getElementById('btnCloseAdminModal');
  const elAdminUserId = document.getElementById('adminUserId');
  let selectedStock = null;

  function triggerHaptic(type = 'light') {
    if (tg && tg.HapticFeedback) {
      tg.HapticFeedback.impactOccurred(type);
    }
  }

  function formatCurrency(val) {
    if (!val || isNaN(val) || val === 0) return "0 đ";
    return new Intl.NumberFormat('vi-VN').format(Math.round(val)) + " đ";
  }

  function formatNumber(val, decimals = 1) {
    if (val === undefined || val === null || isNaN(val)) return "0";
    return Number(val).toFixed(decimals);
  }

  function renderUserTierBadge() {
    if (!elUserTierBadge) return;
    elUserTierBadge.className = 'tier-badge';

    const displayId = (currentUserId && currentUserId !== 'GUEST') ? ` (${currentUserId})` : '';

    if (userTier === 'ADMIN') {
      elUserTierBadge.classList.add('tier-admin');
      elUserTierBadge.textContent = `👑 ADMIN${displayId}`;
      if (elBtnAdminPanel) elBtnAdminPanel.classList.remove('hidden');
    } else if (userTier === 'VIP') {
      elUserTierBadge.classList.add('tier-vip');
      elUserTierBadge.textContent = `⭐ VIP${displayId}`;
      if (elBtnAdminPanel) elBtnAdminPanel.classList.add('hidden');
    } else {
      elUserTierBadge.classList.add('tier-free');
      elUserTierBadge.textContent = `🆓 FREE${displayId}`;
      if (elBtnAdminPanel) elBtnAdminPanel.classList.add('hidden');
    }
  }

  async function loadData(forceRefresh = false) {
    elLoading.classList.remove('hidden');
    elStockList.innerHTML = '';
    elEmpty.classList.add('hidden');

    if (!forceRefresh) {
      const cached = localStorage.getItem(STORAGE_KEYS.CACHE);
      if (cached) {
        try {
          const parsed = JSON.parse(cached);
          allStocks = parsed.stocks || parsed;
          userTier = parsed.userTier || 'FREE';
          renderUserTierBadge();
          renderApp();
          elLoading.classList.add('hidden');
          return;
        } catch (e) {
          console.warn("Cache parse error", e);
        }
      }
    }

    try {
      const apiUrl = `${DEFAULT_API_URL}?action=valuation&user_id=${encodeURIComponent(currentUserId)}${forceRefresh ? '&refresh=true' : ''}`;
      const res = await fetch(apiUrl);
      const data = await res.json();
      
      if (data && data.data && Array.isArray(data.data)) {
        allStocks = data.data;
        userTier = data.user_tier || 'FREE';
      } else if (data && Array.isArray(data)) {
        allStocks = data;
        userTier = 'VIP';
      } else {
        allStocks = SAMPLE_STOCKS;
        userTier = 'FREE';
      }

      renderUserTierBadge();
      localStorage.setItem(STORAGE_KEYS.CACHE, JSON.stringify({ stocks: allStocks, userTier }));
    } catch (err) {
      console.warn("API fetch error, falling back to sample data", err);
      allStocks = SAMPLE_STOCKS;
      userTier = 'FREE';
      renderUserTierBadge();
    }

    elLoading.classList.add('hidden');
    renderApp();
  }

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
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        const t = (stock.ticker || '').toLowerCase();
        const n = (stock.name || '').toLowerCase();
        if (!t.includes(q) && !n.includes(q)) return false;
      }

      if (currentFilter === 'WATCHLIST') {
        if (!watchlist.has(stock.ticker)) return false;
      } else if (currentFilter !== 'ALL') {
        if (stock.valuationLevel !== currentFilter) return false;
      }

      if (currentNganh !== 'ALL' && stock.nganh !== currentNganh) return false;

      // Technical Screener Filtering
      if (currentMacdFilter === 'MACD_CROSS_UP') {
        if (!stock.higherP || stock.higherP === 'LOCKED_VIP') return false;
      } else if (currentMacdFilter === 'MACD_ABOVE_ZERO') {
        if (!stock.aboveP || stock.aboveP === 'LOCKED_VIP') return false;
      }

      if (currentSmartMoneyFilter === 'BUY_RONG') {
        const lbl = stock.smartMoneyLabel || '';
        if (!lbl.includes('mua ròng') && !lbl.includes('Đẩy Giá')) return false;
      } else if (currentSmartMoneyFilter === 'DVX_PLUS') {
        if (!stock.dvx || !stock.dvx.includes('+')) return false;
      }

      if (currentVolFilter === 'VOL_SPIKE') {
        const badge = stock.volBadge || '';
        if (!badge.includes('Bùng Nổ') && !badge.includes('Sức Bật')) return false;
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
      if (counts[s.valuationLevel] !== undefined) counts[s.valuationLevel]++;
    });

    Object.keys(counts).forEach(k => {
      const el = document.getElementById(`count${k}`);
      if (el) el.textContent = counts[k];
    });
  }

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

      card.addEventListener('click', (e) => {
        if (e.target.closest('.star-btn')) return;
        triggerHaptic('light');
        openModal(stock);
      });

      const starBtn = card.querySelector('.star-btn');
      starBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        triggerHaptic('medium');
        toggleWatchlist(stock.ticker);
      });

      elStockList.appendChild(card);
    });
  }

  function renderApp() {
    populateSectors();
    updateKPICounts();
    renderStockList();
  }

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

    document.getElementById('modalFvPE').textContent = userTier === 'FREE' ? '🔒 VIP' : formatCurrency(stock.fvPE);
    document.getElementById('modalFvPB').textContent = userTier === 'FREE' ? '🔒 VIP' : formatCurrency(stock.fvPB);
    document.getElementById('modalFvGraham').textContent = userTier === 'FREE' ? '🔒 VIP' : formatCurrency(stock.fvGraham);

    document.getElementById('modalPE').textContent = formatNumber(stock.pe);
    document.getElementById('modalPB').textContent = formatNumber(stock.pb);
    document.getElementById('modalROE').textContent = `${formatNumber(stock.roe)}%`;
    document.getElementById('modalEPS').textContent = formatNumber(stock.eps, 0);
    document.getElementById('modalBVPS').textContent = formatNumber(stock.bvps, 0);
    document.getElementById('modalVon').textContent = stock.von || 'MID';

    // Technical Analysis Fields
    document.getElementById('modalHigherP').textContent = stock.higherP || '---';
    document.getElementById('modalAboveP').textContent = stock.aboveP || '---';
    document.getElementById('modalMacdDesc').textContent = stock.macdDesc || 'Chi tiết kỹ thuật dành riêng cho tài khoản VIP.';

    document.getElementById('modalSmartMoneyBadge').textContent = stock.smartMoneyBadge || '🔒 Dành Cho VIP';
    document.getElementById('modalSmartMoneyLabel').textContent = stock.smartMoneyLabel || 'Cần nâng cấp VIP';
    document.getElementById('modalDVX').textContent = stock.dvx || '---';
    document.getElementById('modalSmartMoneyDesc').textContent = stock.smartMoneyDesc || 'Khối lượng mua của dòng tiền lớn.';

    document.getElementById('modalVolBadge').textContent = stock.volBadge || '🔥 Vol';
    document.getElementById('modalVolPerMA50').textContent = stock.volPerMA50 || '---';
    document.getElementById('modalMATrend').textContent = stock.maTrend || '---';
    document.getElementById('modalVolDesc').textContent = stock.volDesc || 'Xác nhận đà bứt phá.';

    document.getElementById('modalRRRBadge').textContent = stock.rrrBadge || '🎲 R:R';
    document.getElementById('modalCung').textContent = stock.cung || '---';
    document.getElementById('modalCau').textContent = stock.cau || '---';
    document.getElementById('modalRSIBuyNeed').textContent = stock.rsiBuyNeed || '---';

    if (userTier === 'FREE') {
      elVipLockOverlay.classList.remove('hidden');
      elTaUnlockedContent.classList.add('hidden');
    } else {
      elVipLockOverlay.classList.add('hidden');
      elTaUnlockedContent.classList.remove('hidden');
    }

    switchTab('tabFA');
    updateModalStarButton();
    elModal.classList.remove('hidden');
  }

  function switchTab(tabId) {
    document.querySelectorAll('.modal-tab').forEach(t => {
      if (t.dataset.tab === tabId) t.classList.add('active');
      else t.classList.remove('active');
    });

    document.querySelectorAll('.tab-content').forEach(tc => {
      if (tc.id === tabId) tc.classList.add('active');
      else tc.classList.remove('active');
    });
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

  function openVipPromptModal() {
    triggerHaptic('medium');
    elVipUpgradeModal.classList.remove('hidden');
  }

  function closeVipPromptModal() {
    elVipUpgradeModal.classList.add('hidden');
  }

  function checkTechnicalFilterPermission(selectEl, filterVarName) {
    if (userTier === 'FREE' && selectEl.value !== 'ALL') {
      selectEl.value = 'ALL';
      openVipPromptModal();
      return 'ALL';
    }
    return selectEl.value;
  }

  // Event Listeners for Screener Filters
  elSelectMacd.addEventListener('change', () => {
    currentMacdFilter = checkTechnicalFilterPermission(elSelectMacd, 'currentMacdFilter');
    renderStockList();
  });

  elSelectSmartMoney.addEventListener('change', () => {
    currentSmartMoneyFilter = checkTechnicalFilterPermission(elSelectSmartMoney, 'currentSmartMoneyFilter');
    renderStockList();
  });

  elSelectVol.addEventListener('change', () => {
    currentVolFilter = checkTechnicalFilterPermission(elSelectVol, 'currentVolFilter');
    renderStockList();
  });

  elSearchInput.addEventListener('input', (e) => {
    searchQuery = e.target.value.trim();
    if (searchQuery) elBtnClearSearch.classList.remove('hidden');
    else elBtnClearSearch.classList.add('hidden');
    renderStockList();
  });

  elBtnClearSearch.addEventListener('click', () => {
    elSearchInput.value = '';
    searchQuery = '';
    elBtnClearSearch.classList.add('hidden');
    renderStockList();
  });

  document.querySelectorAll('.kpi-pill').forEach(pill => {
    pill.addEventListener('click', () => {
      triggerHaptic('light');
      document.querySelectorAll('.kpi-pill').forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      currentFilter = pill.dataset.filter;
      renderStockList();
    });
  });

  document.querySelectorAll('.modal-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      triggerHaptic('light');
      switchTab(tab.dataset.tab);
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

  elBtnCloseVipPrompt.addEventListener('click', closeVipPromptModal);
  elVipUpgradeModal.addEventListener('click', (e) => {
    if (e.target === elVipUpgradeModal) closeVipPromptModal();
  });

  document.querySelectorAll('.btnUpgradeVipTrigger, #btnConfirmUpgrade').forEach(btn => {
    btn.addEventListener('click', () => {
      triggerHaptic('medium');
      if (tg) {
        tg.sendData(JSON.stringify({ action: 'UPGRADE_VIP_REQUEST', userId: currentUserId }));
        tg.close();
      } else {
        alert(`Vui lòng chat lệnh /upgrade với Telegram Bot @PhuThuyDauTubot để nâng cấp VIP cho ID ${currentUserId}!`);
      }
    });
  });

  // Admin Panel Event Listeners
  if (elBtnAdminPanel) {
    elBtnAdminPanel.addEventListener('click', () => {
      triggerHaptic('medium');
      if (elAdminUserId) elAdminUserId.textContent = currentUserId;
      elAdminModal.classList.remove('hidden');
    });
  }

  if (elBtnCloseAdminModal) {
    elBtnCloseAdminModal.addEventListener('click', () => {
      elAdminModal.classList.add('hidden');
    });
  }

  // Initial Load
  loadData();
})();

/* ────────────────────────────────────────────────
   공구 공지 바 + 카운트다운
   여기 두 날짜만 바꾸면 전 페이지에 반영됩니다.
──────────────────────────────────────────────── */
(function () {
  // ── 설정 ─────────────────────────────
  var OPEN_DATE  = new Date(2026, 6, 20, 0, 0, 0);  // 오픈: 2026-07-20 (월은 0부터 → 6 = 7월)
  var CLOSE_DATE = new Date(2026, 6, 23, 0, 0, 0);  // 마감: 2026-07-23 (이 시각 지나면 배너 숨김)

  function daysBetween(from, to) {
    var ms = new Date(to).setHours(0,0,0,0) - new Date(from).setHours(0,0,0,0);
    return Math.round(ms / 86400000);
  }

  // ── 상단 공지 바 ──────────────
  // 랜딩 페이지(gonggu.html)에는 바를 넣지 않음 — 이미 그 페이지니까.
  var isLanding = /gonggu\.html$/.test(location.pathname) || !!document.getElementById('gg-countdown');
  var bar = document.getElementById('announce-bar');

  // 마크업이 없는 페이지엔 자동으로 삽입 (index 외 전 페이지 공통 노출)
  if (!bar && !isLanding) {
    bar = document.createElement('div');
    bar.className = 'announce-bar';
    bar.id = 'announce-bar';
    bar.innerHTML =
      '<a href="gonggu.html" class="announce-link">' +
        '<span class="announce-emoji">💙</span>' +
        '<span class="announce-text" id="announce-text">제 인생 첫 공구, <strong>7월 20일 오픈</strong></span>' +
        '<span class="announce-dday" id="announce-dday">D-9</span>' +
        '<span class="announce-cta"><span class="announce-cta-label" id="announce-cta-label">이야기 먼저 읽어보기</span> <span class="announce-arrow">→</span></span>' +
      '</a>' +
      '<button class="announce-close" id="announce-close" aria-label="공지 닫기">×</button>';
    document.body.insertBefore(bar, document.body.firstChild);
  }

  if (bar) {
    var now    = new Date();
    var ddayEl = document.getElementById('announce-dday');
    var textEl = document.getElementById('announce-text');
    var ctaEl  = document.getElementById('announce-cta-label');

    if (sessionStorage.getItem('gonggu-announce-closed') === '1' || now >= CLOSE_DATE) {
      // 세션 중 닫았거나 마감 이후 — 배너 숨김
      bar.classList.add('is-hidden');
    } else {
      if (now >= OPEN_DATE) {
        // 오픈 기간 — 마감 임박 강조
        if (ddayEl) { ddayEl.textContent = '지금 오픈'; ddayEl.classList.add('is-open'); }
        if (textEl) { textEl.innerHTML = '제 인생 첫 공구, <strong>지금 진행 중!</strong>'; }
        if (ctaEl)  { ctaEl.textContent = '혜택 보러가기'; }
      } else {
        // 오픈 전 — D-day 카운트다운
        var d = daysBetween(now, OPEN_DATE);
        if (ddayEl) ddayEl.textContent = d === 0 ? 'D-DAY' : 'D-' + d;
      }

      var closeBtn = document.getElementById('announce-close');
      if (closeBtn) {
        closeBtn.addEventListener('click', function (e) {
          e.preventDefault();
          e.stopPropagation();
          bar.classList.add('is-hidden');
          sessionStorage.setItem('gonggu-announce-closed', '1');
        });
      }
    }
  }

  // ── 랜딩 페이지 카운트다운(있을 때만) ──────────────
  var cd = document.getElementById('gg-countdown');
  var cdWrap = document.getElementById('gg-cd-wrap');
  if (cd) {
    function pad(n){ return (n < 10 ? '0' : '') + n; }
    function tick() {
      var t = new Date();
      if (t >= OPEN_DATE) {
        // 오픈됨 → 카운트다운을 오픈 배지로 교체
        if (cdWrap) {
          cdWrap.innerHTML = '<span class="gg-open-badge">🎉 지금 오픈 중이에요!</span>';
        }
        return;
      }
      var diff = Math.floor((OPEN_DATE - t) / 1000);
      var days = Math.floor(diff / 86400);
      var hrs  = Math.floor((diff % 86400) / 3600);
      var mins = Math.floor((diff % 3600) / 60);
      var secs = diff % 60;
      setNum('gg-days', days);
      setNum('gg-hrs', pad(hrs));
      setNum('gg-mins', pad(mins));
      setNum('gg-secs', pad(secs));
    }
    function setNum(id, v){ var el = document.getElementById(id); if (el) el.textContent = v; }
    tick();
    setInterval(tick, 1000);
  }
})();

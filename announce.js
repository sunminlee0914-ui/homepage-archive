/* ────────────────────────────────────────────────
   공구 공지 바 + 히어로 카드 + 카운트다운
   여기 세 날짜만 바꾸면 전 페이지에 반영됩니다.
──────────────────────────────────────────────── */
(function () {
  // ── 설정 ─────────────────────────────
  var PRE_DATE   = new Date(2026, 6, 18, 0, 0, 0);  // 사전 오픈: 2026-07-18(토) (월은 0부터 → 6 = 7월)
  var OPEN_DATE  = new Date(2026, 6, 20, 0, 0, 0);  // 정식 오픈: 2026-07-20(월)
  var CLOSE_DATE = new Date(2026, 6, 27, 0, 0, 0);  // 마감: 2026-07-26(일) 자정까지 → 27일 0시에 숨김

  function daysBetween(from, to) {
    var ms = new Date(to).setHours(0,0,0,0) - new Date(from).setHours(0,0,0,0);
    return Math.round(ms / 86400000);
  }

  // 현재 단계: 'before' | 'pre' | 'open' | 'closed'
  function phase(t) {
    if (t >= CLOSE_DATE) return 'closed';
    if (t >= OPEN_DATE)  return 'open';
    if (t >= PRE_DATE)   return 'pre';
    return 'before';
  }

  var now = new Date();
  var ph  = phase(now);

  // ── 상단 공지 바 ──────────────
  // 랜딩 페이지(gonggu.html)에는 바를 넣지 않음 — 이미 그 페이지니까.
  var isLanding = /gonggu\.html$/.test(location.pathname) || !!document.getElementById('gg-countdown');
  var bar = document.getElementById('announce-bar');

  // 마크업이 없는 페이지엔 자동으로 삽입 (index 외 전 페이지 공통 노출)
  if (!bar && !isLanding && ph !== 'closed') {
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
    var ddayEl = document.getElementById('announce-dday');
    var textEl = document.getElementById('announce-text');
    var ctaEl  = document.getElementById('announce-cta-label');

    if (sessionStorage.getItem('gonggu-announce-closed') === '1' || ph === 'closed') {
      // 세션 중 닫았거나 마감 이후 — 배너 숨김
      bar.classList.add('is-hidden');
    } else {
      if (ph === 'open') {
        // 본 공구 기간 — 마감 D-day 강조
        var dLeft = daysBetween(now, CLOSE_DATE) - 1; // 마감일(7/26)까지 남은 날
        if (ddayEl) {
          ddayEl.textContent = dLeft <= 0 ? '오늘 마감' : '마감 D-' + dLeft;
          ddayEl.classList.add('is-open');
        }
        if (textEl) { textEl.innerHTML = '제 인생 첫 공구, <strong>지금 진행 중!</strong> 7월 26일(일)까지'; }
        if (ctaEl)  { ctaEl.textContent = '혜택 보러가기'; }
      } else if (ph === 'pre') {
        // 사전 오픈 기간 — 오픈채팅방 단독 릴리즈
        if (ddayEl) { ddayEl.textContent = '사전 오픈'; ddayEl.classList.add('is-open'); }
        if (textEl) { textEl.innerHTML = '제 인생 첫 공구, <strong>시크릿 링크</strong>가 다영 오픈채팅방에 떴어요! 정식 오픈 7월 20일(월)'; }
        if (ctaEl)  { ctaEl.textContent = '미리 보러가기'; }
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

  // ── 히어로 공구 카드 (index.html) ──────────────
  var heroCard = document.getElementById('hero-gonggu-card');
  if (heroCard) {
    if (ph === 'closed') {
      heroCard.style.display = 'none';
    } else {
      var badge = document.getElementById('hgc-badge');
      var note  = document.getElementById('hgc-note');
      if (ph === 'open') {
        var dL = daysBetween(now, CLOSE_DATE) - 1;
        if (badge) { badge.textContent = dL <= 0 ? '오늘 마감!' : '진행 중 · 마감 D-' + dL; badge.classList.add('is-open'); }
        if (note)  { note.textContent = '7월 26일(일)까지, 놓치지 마세요'; }
      } else if (ph === 'pre') {
        if (badge) { badge.textContent = '사전 오픈'; badge.classList.add('is-open'); }
        if (note)  { note.textContent = '시크릿 링크, 지금 채팅방에만 있어요'; }
      } else {
        var dO = daysBetween(now, OPEN_DATE);
        if (badge) badge.textContent = dO === 0 ? 'D-DAY' : 'D-' + dO;
      }
    }
  }

  // ── 마퀴(노란 띠) — 공구 기간엔 공구 알림으로 변신 ──────────────
  // 마감 후엔 이 코드가 실행되지 않아 원래 브랜드 키워드로 자동 복귀
  var mqTrack = document.querySelector('.marquee-track');
  if (mqTrack && ph !== 'closed') {
    var pillMain, items;
    if (ph === 'open') {
      var mqLeft = daysBetween(now, CLOSE_DATE) - 1;
      pillMain = '<span class="marquee-pill is-hot">' + (mqLeft <= 0 ? '오늘 마감' : '마감 D-' + mqLeft) + '</span>';
      items = [
        '💙 제 인생 첫 공구, 지금 진행 중',
        pillMain,
        '더클린 방탄원두',
        '분말형 방탄커피',
        '7월 26일(일)까지',
        '<span class="marquee-arrow-hint">자세히 보기 →</span>'
      ];
    } else if (ph === 'pre') {
      pillMain = '<span class="marquee-pill is-hot">사전 오픈</span>';
      items = [
        '💙 제 인생 첫 공구',
        pillMain,
        '시크릿 링크, 채팅방에 떴어요',
        '더클린 방탄원두',
        '분말형 방탄커피',
        '정식 오픈 7월 20일(월)',
        '<span class="marquee-arrow-hint">자세히 보기 →</span>'
      ];
    } else {
      var mqD = daysBetween(now, OPEN_DATE);
      pillMain = '<span class="marquee-pill">' + (mqD === 0 ? 'D-DAY' : 'D-' + mqD) + '</span>';
      items = [
        '💙 제 인생 첫 공구',
        pillMain,
        '7월 20일(월) 오픈',
        '더클린 방탄원두',
        '분말형 방탄커피',
        '시크릿 링크는 채팅방에 제일 먼저',
        '<span class="marquee-arrow-hint">자세히 보기 →</span>'
      ];
    }
    var seq = items.map(function (it) {
      return (it.indexOf('<span') === 0 ? it : '<span>' + it + '</span>') + '<span class="marquee-dot">·</span>';
    }).join('');
    mqTrack.innerHTML = seq + seq; // 두 벌 복제 — 끊김 없는 루프 유지

    var mqWrap = mqTrack.closest('.marquee-wrap');
    if (mqWrap) {
      mqWrap.classList.add('is-gonggu');
      mqWrap.setAttribute('role', 'link');
      mqWrap.setAttribute('aria-label', '공구 안내 페이지로 이동');
      mqWrap.addEventListener('click', function () { location.href = 'gonggu.html'; });
    }
  }

  // ── 모바일 하단 플로팅 바 (공구 페이지 제외, 공구 기간에만) ──────────────
  if (!isLanding && ph !== 'closed' && sessionStorage.getItem('gonggu-fab-closed') !== '1') {
    var fabTxt, fabBtn;
    if (ph === 'open') {
      var fabLeft = daysBetween(now, CLOSE_DATE) - 1;
      fabTxt = '🔥 <strong>첫 공구 진행 중</strong> · ' + (fabLeft <= 0 ? '오늘 마감!' : '7.26(일) 마감');
      fabBtn = '지금 보기 →';
    } else if (ph === 'pre') {
      fabTxt = '⚡ <strong>사전 오픈!</strong> 시크릿 링크가 채팅방에 떴어요';
      fabBtn = '보러 가기 →';
    } else {
      var fabD = daysBetween(now, OPEN_DATE);
      fabTxt = '💙 <strong>첫 공구 ' + (fabD === 0 ? 'D-DAY' : 'D-' + fabD) + '</strong> · 더클린 방탄커피 7.20 오픈';
      fabBtn = '미리 보기 →';
    }
    var fab = document.createElement('a');
    fab.href = 'gonggu.html';
    fab.className = 'gonggu-fab';
    fab.id = 'gonggu-fab';
    fab.innerHTML =
      '<span class="gonggu-fab-txt">' + fabTxt + '</span>' +
      '<span class="gonggu-fab-btn">' + fabBtn + '</span>' +
      '<button class="gonggu-fab-close" aria-label="공구 알림 닫기">×</button>';
    document.body.appendChild(fab);

    fab.querySelector('.gonggu-fab-close').addEventListener('click', function (e) {
      e.preventDefault();
      e.stopPropagation();
      fab.classList.remove('is-visible');
      sessionStorage.setItem('gonggu-fab-closed', '1');
    });

    // 살짝 스크롤하면 아래에서 등장 (첫 화면은 가리지 않음)
    var fabShown = false;
    function fabCheck() {
      if (!fabShown && window.scrollY > 240) {
        fabShown = true;
        fab.classList.add('is-visible');
        window.removeEventListener('scroll', fabCheck);
      }
    }
    window.addEventListener('scroll', fabCheck, { passive: true });
    fabCheck();
  }

  // ── 랜딩 페이지 카운트다운(있을 때만) ──────────────
  var cd = document.getElementById('gg-countdown');
  var cdWrap = document.getElementById('gg-cd-wrap');
  if (cd) {
    function pad(n){ return (n < 10 ? '0' : '') + n; }
    function tick() {
      var t = new Date();
      var p = phase(t);
      if (p === 'closed') {
        if (cdWrap) cdWrap.innerHTML = '<span class="gg-open-badge" style="background:rgba(250,248,243,0.14);">이번 공구는 마감되었어요 🙏 다음에 또 만나요</span>';
        return;
      }
      if (p === 'open') {
        if (cdWrap) cdWrap.innerHTML = '<span class="gg-open-badge">🎉 지금 오픈 중 · 7월 26일(일) 마감</span>';
        return;
      }
      if (p === 'pre') {
        var pb = document.getElementById('gg-prenote');
        if (pb) pb.style.display = 'block';
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

/* スライドの操作: クリック／「次へ」「戻る」／左右の矢印キー（スペース・PageUp/PageDown・Home/End も可）。URL の #3 などで開くページを指定できる */
(function () {
  var deck = document.getElementById('deck');
  var slides = Array.prototype.slice.call(deck.querySelectorAll('.slide'));
  var num = document.getElementById('num');
  var prev = document.getElementById('prev');
  var next = document.getElementById('next');
  var total = slides.length;
  var current = 0;

  function fit() {
    var s = Math.min(window.innerWidth / 1920, window.innerHeight / 1080);
    deck.style.transform = 'scale(' + s + ')';
  }

  function show(i) {
    current = Math.max(0, Math.min(total - 1, i));
    slides.forEach(function (el, n) {
      el.classList.toggle('is-active', n === current);
      el.setAttribute('aria-hidden', n === current ? 'false' : 'true');
    });
    num.textContent = (current + 1) + ' / ' + total;
    prev.disabled = current === 0;
    next.disabled = current === total - 1;
    document.title = (current + 1) + '/' + total + ' ' + (slides[current].getAttribute('data-title') || '') + '｜YUSHIN WEBSITE';
    if (history.replaceState) { history.replaceState(null, '', '#' + (current + 1)); }
  }

  prev.addEventListener('click', function (e) { e.stopPropagation(); show(current - 1); });
  next.addEventListener('click', function (e) { e.stopPropagation(); show(current + 1); });
  // 画面のクリックで次へ（操作ボタンの上は除く）
  document.getElementById('viewport').addEventListener('click', function () { show(current + 1); });
  document.addEventListener('keydown', function (e) {
    if (e.altKey || e.ctrlKey || e.metaKey) { return; }
    var k = e.key;
    if (k === 'ArrowRight' || k === 'PageDown' || k === ' ' || k === 'Enter') {
      if (k === 'Enter' && e.target.tagName === 'BUTTON') { return; }
      e.preventDefault(); show(current + 1);
    } else if (k === 'ArrowLeft' || k === 'PageUp' || k === 'Backspace') {
      e.preventDefault(); show(current - 1);
    } else if (k === 'Home') {
      e.preventDefault(); show(0);
    } else if (k === 'End') {
      e.preventDefault(); show(total - 1);
    }
  });
  window.addEventListener('resize', fit);

  // 操作ボタンは、マウスを動かしたとき・キー操作のときだけ表示し、しばらくすると隠す（スライドに重ならないように）
  var controls = document.getElementById('controls');
  var hideTimer = null;
  function reveal() {
    controls.classList.add('is-visible');
    clearTimeout(hideTimer);
    hideTimer = setTimeout(function () { controls.classList.remove('is-visible'); }, 2500);
  }
  document.addEventListener('mousemove', reveal);
  document.addEventListener('keydown', reveal);

  function fromHash() {
    var n = parseInt((location.hash || '').replace('#', ''), 10);
    return isNaN(n) ? null : n - 1;
  }
  window.addEventListener('hashchange', function () {
    var n = fromHash();
    if (n !== null && n !== current) { show(n); }
  });
  fit();
  show(fromHash() || 0);
})();

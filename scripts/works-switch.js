/* YUSHIN WORKS — 複数の施工事例の切り替え
   ・2件以上のとき、ゆっくり自動で切り替える（一度動くことで切り替えられると気づけるように）
   ・写真エリアにマウスを乗せている間・キーボード操作中・タッチ中は止める
   ・左右の矢印 / スマホでは左右スワイプで手動切り替え
   ・「視覚効果を減らす」設定では自動切り替えしない */
(function () {
  var root = document.querySelector(".works-compare--switch");
  if (!root) return;

  var count = parseInt(root.getAttribute("data-works-count"), 10) || 0;
  if (count < 2) return;

  var AUTO_MS = 5000;   // 自動で次へ進む間隔
  var RESUME_MS = 6000; // 手動操作・マウス離脱・タッチ終了のあと、再開までの待ち時間
  var SWIPE_PX = 40;    // スワイプとみなす横移動量

  var slides = root.querySelectorAll("[data-slide]");
  var photos = root.querySelector(".works-compare__photos");
  var prev = root.querySelector(".works-compare__arrow--prev");
  var next = root.querySelector(".works-compare__arrow--next");
  var counter = root.querySelector(".works-compare__count");
  var current = root.querySelector(".works-compare__count-current");
  if (!photos || !prev || !next) return;

  var reduce = window.matchMedia ? window.matchMedia("(prefers-reduced-motion: reduce)") : null;
  var index = 0;
  var timer = null;
  var visible = !("IntersectionObserver" in window); // 画面に見えている間だけ自動で動かす
  var hovering = false;
  var focused = false;
  var touching = false;

  function pad(n) {
    return (n < 10 ? "0" : "") + n;
  }

  function show(i, byUser) {
    index = (i + count) % count;
    // 自動切り替えでは読み上げを行わず、手動操作のときだけ現在位置を読み上げる
    if (counter) counter.setAttribute("aria-live", byUser ? "polite" : "off");
    Array.prototype.forEach.call(slides, function (el) {
      el.classList.toggle("is-active", parseInt(el.getAttribute("data-slide"), 10) === index);
    });
    if (current) current.textContent = pad(index + 1);
  }

  function canRun() {
    return !(reduce && reduce.matches) && visible && !hovering && !focused && !touching && !document.hidden;
  }

  function stop() {
    if (timer) clearTimeout(timer);
    timer = null;
  }

  function schedule(delay) {
    stop();
    if (canRun()) timer = setTimeout(tick, delay);
  }

  function tick() {
    timer = null;
    show(index + 1, false);
    schedule(AUTO_MS);
  }

  function manual(i) {
    show(i, true);
    schedule(RESUME_MS); // 手動操作の直後に自動で進まないよう、待ち時間を置く
  }

  /* 矢印 */
  prev.addEventListener("click", function () { manual(index - 1); });
  next.addEventListener("click", function () { manual(index + 1); });

  /* マウスが写真エリアにある間は止める（タッチ端末の擬似 hover は無視） */
  photos.addEventListener("pointerenter", function (e) {
    if (e.pointerType !== "mouse") return;
    hovering = true;
    stop();
  });
  photos.addEventListener("pointerleave", function (e) {
    if (e.pointerType !== "mouse") return;
    hovering = false;
    schedule(RESUME_MS);
  });

  /* キーボードで矢印にフォーカスしている間は止める（マウスクリックによるフォーカスは対象外） */
  photos.addEventListener("focusin", function (e) {
    try { focused = e.target.matches(":focus-visible"); } catch (err) { focused = true; }
    if (focused) stop();
  });
  photos.addEventListener("focusout", function () {
    if (!focused) return;
    focused = false;
    schedule(RESUME_MS);
  });

  /* タッチ: 触れている間は止める。横スワイプで前後へ（縦スクロールはブラウザに任せる） */
  var startX = 0;
  var startY = 0;
  photos.addEventListener("pointerdown", function (e) {
    if (e.pointerType !== "touch") return;
    touching = true;
    startX = e.clientX;
    startY = e.clientY;
    stop();
  });
  photos.addEventListener("pointerup", function (e) {
    if (e.pointerType !== "touch" || !touching) return;
    touching = false;
    var dx = e.clientX - startX;
    var dy = e.clientY - startY;
    if (Math.abs(dx) >= SWIPE_PX && Math.abs(dx) > Math.abs(dy) * 1.5) {
      manual(index + (dx < 0 ? 1 : -1));
    } else {
      schedule(RESUME_MS);
    }
  });
  photos.addEventListener("pointercancel", function (e) {
    if (e.pointerType !== "touch") return;
    touching = false;
    schedule(RESUME_MS);
  });

  /* 画面外・別タブの間は動かさない */
  if ("IntersectionObserver" in window) {
    new IntersectionObserver(function (entries) {
      visible = entries[entries.length - 1].isIntersecting;
      if (visible) schedule(AUTO_MS); else stop();
    }, { threshold: 0.4 }).observe(photos);
  }
  document.addEventListener("visibilitychange", function () {
    if (document.hidden) stop(); else schedule(RESUME_MS);
  });
  if (reduce && reduce.addEventListener) {
    reduce.addEventListener("change", function () {
      if (reduce.matches) stop(); else schedule(AUTO_MS);
    });
  }

  schedule(AUTO_MS);
})();

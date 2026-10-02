/* YUSHIN PROPERTY — 一覧の種別絞り込み / 詳細の写真拡大表示（どちらも JS がなくても内容は見られる） */
(function () {
  /* ---- 一覧: 種別で絞り込む（ページ遷移なし） ---- */
  var filter = document.querySelector("[data-pp-filter]");
  if (filter) {
    var cards = document.querySelectorAll(".pp-card[data-kind]");
    var count = document.querySelector("[data-pp-count]");
    var empty = document.querySelector("[data-pp-empty]");
    var buttons = filter.querySelectorAll("button[data-kind]");
    filter.hidden = false;

    filter.addEventListener("click", function (e) {
      var btn = e.target.closest("button[data-kind]");
      if (!btn) return;
      var kind = btn.getAttribute("data-kind");
      var shown = 0;
      buttons.forEach(function (b) { b.setAttribute("aria-pressed", String(b === btn)); });
      cards.forEach(function (card) {
        var match = !kind || card.getAttribute("data-kind") === kind;
        card.hidden = !match;
        if (match) shown += 1;
      });
      if (count) count.textContent = String(shown);
      if (empty) empty.hidden = shown > 0;
    });
  }

  /* ---- 詳細: 写真の拡大表示 ---- */
  var dialog = document.querySelector("[data-pp-lightbox]");
  var gallery = document.querySelector("[data-pp-gallery]");
  if (!dialog || !gallery || typeof dialog.showModal !== "function") return;

  var links = Array.prototype.slice.call(gallery.querySelectorAll("a[data-pp-index]"));
  var img = dialog.querySelector("[data-pp-lightbox-img]");
  var cap = dialog.querySelector("[data-pp-lightbox-cap]");
  var counter = dialog.querySelector("[data-pp-lightbox-count]");
  var current = 0;

  function show(i) {
    current = (i + links.length) % links.length;
    var a = links[current];
    var thumb = a.querySelector("img");
    img.src = a.getAttribute("href");
    img.alt = thumb ? thumb.alt : "";
    cap.textContent = a.getAttribute("data-pp-caption") || "";
    counter.textContent = (current + 1) + " / " + links.length;
  }
  function open(i) {
    show(i);
    if (!dialog.open) dialog.showModal();
  }

  links.forEach(function (a, i) {
    a.addEventListener("click", function (e) {
      e.preventDefault();
      open(i);
    });
  });
  document.querySelectorAll("[data-pp-open]").forEach(function (a) {
    a.addEventListener("click", function (e) {
      e.preventDefault();
      open(parseInt(a.getAttribute("data-pp-open"), 10) || 0);
    });
  });

  dialog.querySelector("[data-pp-close]").addEventListener("click", function () { dialog.close(); });
  dialog.querySelector("[data-pp-prev]").addEventListener("click", function () { show(current - 1); });
  dialog.querySelector("[data-pp-next]").addEventListener("click", function () { show(current + 1); });
  // 写真の外側を押したら閉じる（ダイアログ全面を内側の枠が覆うため、枠そのものを押したときも閉じる）
  var inner = dialog.querySelector(".pp-lightbox__inner");
  dialog.addEventListener("click", function (e) {
    if (e.target === dialog || e.target === inner) dialog.close();
  });
  dialog.addEventListener("keydown", function (e) {
    if (e.key === "ArrowLeft") show(current - 1);
    if (e.key === "ArrowRight") show(current + 1);
  });
  if (links.length < 2) {
    dialog.querySelectorAll("[data-pp-prev], [data-pp-next]").forEach(function (b) { b.hidden = true; });
  }
})();

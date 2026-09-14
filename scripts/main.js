/* YUSHIN 提案用デモサイト — 最小限のJS（モバイルナビ開閉のみ） */
(function () {
  var header = document.querySelector(".site-header");
  var toggle = document.getElementById("navToggle");
  var nav = document.getElementById("mainNav");
  if (!header || !toggle || !nav) return;

  toggle.addEventListener("click", function () {
    var isOpen = header.classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", String(isOpen));
    toggle.setAttribute("aria-label", isOpen ? "メニューを閉じる" : "メニューを開く");
  });

  nav.addEventListener("click", function (e) {
    if (e.target.tagName === "A") {
      header.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
      toggle.setAttribute("aria-label", "メニューを開く");
    }
  });
})();

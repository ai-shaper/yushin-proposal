/* YUSHIN WORKS（静的デモ）— 施工事例一覧の種別の絞り込み
   WordPress 版はページを読み込み直して絞り込む（?work_type=）が、静的デモではページ内で切り替える。
   JavaScript が使えないときは絞り込みボタンを出さず、全件をそのまま表示する。 */
(function () {
  var filter = document.querySelector("[data-works-filter]");
  if (!filter) return;
  var links = filter.querySelectorAll("a[data-work-type]");
  var cards = document.querySelectorAll(".works-card[data-work-type]");
  filter.hidden = false;

  function apply(type) {
    for (var i = 0; i < links.length; i++) {
      if (links[i].getAttribute("data-work-type") === type) {
        links[i].setAttribute("aria-current", "page");
      } else {
        links[i].removeAttribute("aria-current");
      }
    }
    for (var j = 0; j < cards.length; j++) {
      cards[j].hidden = !!type && cards[j].getAttribute("data-work-type") !== type;
    }
  }

  filter.addEventListener("click", function (e) {
    var link = e.target.closest("a[data-work-type]");
    if (!link) return;
    e.preventDefault();
    apply(link.getAttribute("data-work-type"));
  });

  // WordPress 版と同じ ?work_type=reform 形式の URL で開いたときも、その種別を表示する
  var m = location.search.match(/[?&]work_type=(\w+)/);
  if (m && filter.querySelector('a[data-work-type="' + m[1] + '"]')) apply(m[1]);
})();

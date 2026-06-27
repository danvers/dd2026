(function () {
  var tabs = document.querySelectorAll(".day-tab");
  var panels = document.querySelectorAll(".day-panel");

  if (tabs.length) {
    tabs.forEach(function (tab) {
      tab.addEventListener("click", function () {
        var day = tab.getAttribute("data-day");
        tabs.forEach(function (t) { t.classList.toggle("is-active", t === tab); });
        panels.forEach(function (p) {
          p.classList.toggle("is-active", p.getAttribute("data-day") === day);
        });
      });
    });
  }

  document.querySelectorAll(".schedule-item.has-details").forEach(function (item) {
    var row = item.querySelector(".schedule-row");
    var panel = item.querySelector(".schedule-panel");
    row.addEventListener("click", function () {
      var open = item.classList.toggle("is-open");
      row.setAttribute("aria-expanded", open ? "true" : "false");
      panel.style.maxHeight = open ? panel.scrollHeight + "px" : "0px";
    });
  });
})();

(function () {
  var tabs = document.querySelectorAll(".day-tab");
  var panels = document.querySelectorAll(".day-panel");

  function activate(day) {
    var match = false;
    tabs.forEach(function (t) {
      var on = t.getAttribute("data-day") === day;
      t.classList.toggle("is-active", on);
      if (on) { match = true; }
    });
    panels.forEach(function (p) {
      p.classList.toggle("is-active", p.getAttribute("data-day") === day);
    });
    return match;
  }

  function openItem(item) {
    var row = item.querySelector(".schedule-row");
    var panel = item.querySelector(".schedule-panel");
    item.classList.add("is-open");
    row.setAttribute("aria-expanded", "true");
    panel.style.maxHeight = panel.scrollHeight + "px";
  }

  if (tabs.length) {
    tabs.forEach(function (tab) {
      tab.addEventListener("click", function () {
        activate(tab.getAttribute("data-day"));
      });
    });

    // open the day (e.g. /program/#wed) or the specific schedule item
    // (e.g. /program/#thu-ciston) referenced in the URL hash
    var fromHash = function () {
      var hash = (location.hash || "").replace("#", "");
      if (!hash) { return; }

      var item = document.getElementById(hash);
      if (item && item.classList.contains("schedule-item")) {
        var dayPanel = item.closest(".day-panel");
        if (dayPanel) { activate(dayPanel.getAttribute("data-day")); }
        if (item.classList.contains("has-details")) { openItem(item); }
        item.scrollIntoView({ behavior: "smooth", block: "center" });
      } else {
        activate(hash);
      }
    };
    fromHash();
    window.addEventListener("hashchange", fromHash);
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

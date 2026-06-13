function initResponsiveNav() {
  const toggle = document.getElementById("navToggle");
  const menu = document.getElementById("navMenu");
  if (!toggle || !menu) return;

  toggle.addEventListener("click", function () {
    const expanded = this.getAttribute("aria-expanded") === "true";
    this.setAttribute("aria-expanded", !expanded);
    menu.classList.toggle("hidden");
  });

  document.addEventListener("click", function (e) {
    if (!toggle.contains(e.target) && !menu.contains(e.target)) {
      menu.classList.add("hidden");
      toggle.setAttribute("aria-expanded", "false");
    }
  });
}

function initResponsiveTables() {
  document.querySelectorAll(".responsive-table-wrap").forEach(function (wrap) {
    const table = wrap.querySelector("table");
    if (!table) return;
    if (table.scrollWidth > wrap.clientWidth) {
      wrap.classList.add("has-scroll");
    }
  });
}

document.addEventListener("DOMContentLoaded", function () {
  initResponsiveNav();
  initResponsiveTables();
});

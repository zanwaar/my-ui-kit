// core/js/dropdown.js
// Vanilla JS. Struktur HTML yang diharapkan:
// <div class="dropdown">
//   <button data-dropdown-toggle>Menu</button>
//   <div data-dropdown-menu class="hidden">...</div>
// </div>

(function () {
  document.addEventListener("click", function (e) {
    const toggle = e.target.closest("[data-dropdown-toggle]");

    // Tutup semua dropdown lain dulu
    document.querySelectorAll("[data-dropdown-menu]").forEach((menu) => {
      if (!toggle || menu !== toggle.parentElement.querySelector("[data-dropdown-menu]")) {
        menu.classList.add("hidden");
      }
    });

    if (toggle) {
      const menu = toggle.parentElement.querySelector("[data-dropdown-menu]");
      if (menu) menu.classList.toggle("hidden");
      e.stopPropagation();
    }
  });
})();

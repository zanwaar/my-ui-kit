// core/js/sidebar.js
// Toggle collapsible sidebar submenu.
// Expected trigger: [data-sidebar-toggle][aria-expanded]

(function () {
  function getSubmenu(toggle) {
    const submenu = toggle.nextElementSibling;
    return submenu && submenu.classList.contains("sidebar-submenu") ? submenu : null;
  }

  function openSubmenu(toggle, submenu) {
    toggle.setAttribute("aria-expanded", "true");
    submenu.style.height = `${submenu.scrollHeight}px`;

    submenu.addEventListener(
      "transitionend",
      function handleTransitionEnd() {
        if (toggle.getAttribute("aria-expanded") === "true") {
          submenu.style.height = "auto";
        }
      },
      { once: true }
    );
  }

  function closeSubmenu(toggle, submenu) {
    toggle.setAttribute("aria-expanded", "false");
    submenu.style.height = `${submenu.scrollHeight}px`;

    requestAnimationFrame(function () {
      submenu.style.height = "0px";
    });
  }

  function prepareSubmenus() {
    document.querySelectorAll("[data-sidebar-toggle][aria-expanded]").forEach(function (toggle) {
      const submenu = getSubmenu(toggle);
      if (!submenu) return;

      submenu.style.height = toggle.getAttribute("aria-expanded") === "true" ? "auto" : "0px";
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", prepareSubmenus);
  } else {
    prepareSubmenus();
  }

  document.addEventListener("click", function (e) {
    const toggle = e.target.closest("[data-sidebar-toggle]");
    if (!toggle) return;

    const submenu = getSubmenu(toggle);
    if (!submenu) return;

    if (toggle.getAttribute("aria-expanded") === "true") {
      closeSubmenu(toggle, submenu);
    } else {
      openSubmenu(toggle, submenu);
    }

    e.preventDefault();
  });
})();

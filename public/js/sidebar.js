// core/js/sidebar.js
// piceUI v2 sidebar submenu plugin. Backward compatible with [data-sidebar-toggle][aria-expanded].

(function () {
  const PiceUI = (window.PiceUI = window.PiceUI || {});
  const BasePlugin = PiceUI.Plugin || class {
    constructor(element, options) {
      this.el = element || null;
      this.options = options || {};
      this.cleanups = [];
      this.initialized = false;
    }

    init() {
      this.initialized = true;
      return this;
    }

    on(element, eventName, handler, options) {
      element.addEventListener(eventName, handler, options);
      this.cleanups.push(function () {
        element.removeEventListener(eventName, handler, options);
      });
    }

    emit(name, detail) {
      if (!this.el) return null;
      return this.el.dispatchEvent(new CustomEvent(name, { detail: detail || {}, bubbles: true, cancelable: true }));
    }
  };

  class PiceSidebar extends BasePlugin {
    constructor(element, options) {
      super(element || document, options);
      this.toggleSelector = "[data-sidebar-toggle][aria-expanded]";
      this.submenuClass = "sidebar-submenu";
      this.onDocumentClick = this.handleDocumentClick.bind(this);
    }

    init() {
      if (this.initialized) return this;
      if (super.init) super.init();

      this.ready(() => this.prepare());
      this.on(document, "click", this.onDocumentClick);

      return this;
    }

    ready(callback) {
      if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", callback, { once: true });
      } else {
        callback();
      }
    }

    getSubmenu(toggle) {
      const submenu = toggle ? toggle.nextElementSibling : null;
      return submenu && submenu.classList.contains(this.submenuClass) ? submenu : null;
    }

    prepare() {
      document.querySelectorAll(this.toggleSelector).forEach((toggle) => {
        const submenu = this.getSubmenu(toggle);
        if (!submenu) return;

        submenu.style.height = toggle.getAttribute("aria-expanded") === "true" ? "auto" : "0px";
      });
    }

    open(toggle) {
      const submenu = this.getSubmenu(toggle);
      if (!submenu) return;

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

      this.emit("pui:sidebar:open", { toggle, submenu });
    }

    close(toggle) {
      const submenu = this.getSubmenu(toggle);
      if (!submenu) return;

      toggle.setAttribute("aria-expanded", "false");
      submenu.style.height = `${submenu.scrollHeight}px`;

      requestAnimationFrame(function () {
        submenu.style.height = "0px";
      });

      this.emit("pui:sidebar:close", { toggle, submenu });
    }

    toggle(toggle) {
      if (toggle.getAttribute("aria-expanded") === "true") this.close(toggle);
      else this.open(toggle);
    }

    handleDocumentClick(event) {
      const toggle = event.target.closest("[data-sidebar-toggle]");
      if (!toggle) return;

      const submenu = this.getSubmenu(toggle);
      if (!submenu) return;

      this.toggle(toggle);
      event.preventDefault();
    }
  }

  const instance = new PiceSidebar(document).init();

  PiceUI.Sidebar = PiceSidebar;
  PiceUI.sidebar = instance;
})();

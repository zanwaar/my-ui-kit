// core/js/theme-toggle.js
// piceUI v2 theme plugin. Backward compatible with [data-theme-toggle].

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

  class PiceTheme extends BasePlugin {
    constructor(element, options) {
      super(element || document.documentElement, options);
      this.storageKey = "ui-kit-theme";
      this.themes = ["light", "dark", "corporate", "soft", "luxury"];
      this.root = document.documentElement;
      this.onDocumentClick = this.handleDocumentClick.bind(this);
    }

    init() {
      if (this.initialized) return this;
      if (super.init) super.init();

      this.apply(this.getInitialTheme(), { persist: false });
      this.on(document, "click", this.onDocumentClick);

      return this;
    }

    normalize(theme) {
      return this.themes.includes(theme) ? theme : null;
    }

    getInitialTheme() {
      const saved = this.normalize(localStorage.getItem(this.storageKey));
      if (saved) return saved;

      const current = this.normalize(this.root.dataset.theme);
      if (current) return current;

      return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    }

    getCurrentTheme() {
      return this.normalize(this.root.dataset.theme) || "light";
    }

    getNextTheme() {
      const current = this.getCurrentTheme();
      const index = this.themes.indexOf(current);
      return this.themes[(index + 1) % this.themes.length];
    }

    apply(theme, options) {
      const next = this.normalize(theme) || "light";
      const shouldPersist = !options || options.persist !== false;

      this.root.dataset.theme = next;
      this.root.classList.toggle("dark", next === "dark" || next === "luxury");

      document.querySelectorAll("[data-theme-toggle]").forEach(function (button) {
        button.setAttribute("data-theme-current", next);
        if (button.hasAttribute("data-theme-toggle-label")) {
          button.textContent = next.charAt(0).toUpperCase() + next.slice(1);
        }
      });

      if (shouldPersist) localStorage.setItem(this.storageKey, next);
      this.emit("pui:theme:change", { theme: next });

      return next;
    }

    handleDocumentClick(event) {
      const button = event.target.closest("[data-theme-toggle]");
      if (!button) return;

      const explicitTheme = this.normalize(button.getAttribute("data-theme-toggle"));
      this.apply(explicitTheme || this.getNextTheme());
    }
  }

  const instance = new PiceTheme(document.documentElement).init();

  PiceUI.Theme = PiceTheme;
  PiceUI.theme = instance;
  window.PiceUITheme = {
    themes: instance.themes.slice(),
    apply(theme) {
      return instance.apply(theme);
    }
  };
})();

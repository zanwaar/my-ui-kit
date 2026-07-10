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
      this.storageKey = 'ui-kit-theme';
      this.themes = ['light', 'dark', 'black', 'claude', 'corporate', 'ghibli', 'gourmet', 'luxury', 'marshmallow', 'mintlify', 'pastel', 'perplexity', 'shadcn', 'slack', 'soft', 'spotify', 'valorant', 'vscode'];
      this.darkThemes = ['dark', 'black', 'luxury', 'perplexity', 'spotify', 'valorant', 'vscode'];
      this.root = document.documentElement;
      this.onDocumentClick = this.handleDocumentClick.bind(this);
    }

    init() {
      if (this.initialized) return this;
      if (super.init) super.init();

      this.apply(this.getInitialTheme(), { persist: false });
      this.on(document, 'click', this.onDocumentClick);

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

      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }

    getCurrentTheme() {
      return this.normalize(this.root.dataset.theme) || 'light';
    }

    getNextTheme() {
      const current = this.getCurrentTheme();
      const index = this.themes.indexOf(current);
      return this.themes[(index + 1) % this.themes.length];
    }

    apply(theme, options) {
      const next = this.normalize(theme) || 'light';
      const shouldPersist = !options || options.persist !== false;

      this.root.dataset.theme = next;
      this.root.classList.toggle('dark', this.darkThemes.includes(next));

      document.querySelectorAll('[data-theme-toggle]').forEach(function (button) {
        button.setAttribute('data-theme-current', next);
      });

      document.querySelectorAll('[data-theme-toggle-label]').forEach(function (node) {
        node.textContent = next.charAt(0).toUpperCase() + next.slice(1);
      });

      document.querySelectorAll('[data-theme-option]').forEach(function (button) {
        const active = button.getAttribute('data-theme-option') === next;
        button.setAttribute('aria-pressed', active ? 'true' : 'false');
        button.classList.toggle('dropdown-active', active);
      });

      if (shouldPersist) localStorage.setItem(this.storageKey, next);
      this.emit('pui:theme:change', { theme: next });

      return next;
    }

    handleDocumentClick(event) {
      const button = event.target.closest('[data-theme-toggle]');
      if (button) {
        const explicitTheme = this.normalize(button.getAttribute('data-theme-toggle'));
        this.apply(explicitTheme || this.getNextTheme());
        return;
      }

      const option = event.target.closest('[data-theme-option]');
      if (option) {
        this.apply(option.getAttribute('data-theme-option'));
      }
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

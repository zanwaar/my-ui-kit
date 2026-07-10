// core/js/dropdown.js
// piceUI v2 dropdown plugin. Backward compatible with [data-dropdown-toggle].

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

  class PiceDropdown extends BasePlugin {
    constructor(element, options) {
      super(element || document, options);
      this.toggleSelector = "[data-dropdown-toggle]";
      this.menuSelector = "[data-dropdown-menu]";
      this.hiddenClass = "hidden";
      this.onDocumentClick = this.handleDocumentClick.bind(this);
    }

    init() {
      if (this.initialized) return this;
      if (super.init) super.init();
      this.on(document, "click", this.onDocumentClick);
      return this;
    }

    getMenu(toggle) {
      if (!toggle || !toggle.parentElement) return null;
      return toggle.parentElement.querySelector(this.menuSelector);
    }

    isOpen(menu) {
      return menu && !menu.classList.contains(this.hiddenClass);
    }

    open(toggle) {
      const menu = this.getMenu(toggle);
      if (!menu) return;

      menu.classList.remove(this.hiddenClass);
      toggle.setAttribute("aria-expanded", "true");
      this.emit("pui:dropdown:open", { toggle, menu });
    }

    close(toggle) {
      const menu = this.getMenu(toggle);
      if (!menu) return;

      menu.classList.add(this.hiddenClass);
      toggle.setAttribute("aria-expanded", "false");
      this.emit("pui:dropdown:close", { toggle, menu });
    }

    closeAll(exceptToggle) {
      document.querySelectorAll(this.menuSelector).forEach((menu) => {
        if (exceptToggle && menu === this.getMenu(exceptToggle)) return;

        menu.classList.add(this.hiddenClass);
        const toggle = menu.parentElement ? menu.parentElement.querySelector(this.toggleSelector) : null;
        if (toggle) toggle.setAttribute("aria-expanded", "false");
      });
    }

    toggle(toggle) {
      const menu = this.getMenu(toggle);
      if (!menu) return;

      if (this.isOpen(menu)) this.close(toggle);
      else this.open(toggle);
    }

    handleDocumentClick(event) {
      const toggle = event.target.closest(this.toggleSelector);
      this.closeAll(toggle);

      if (!toggle) return;

      this.toggle(toggle);
      event.stopPropagation();
    }
  }

  const instance = new PiceDropdown(document).init();

  PiceUI.Dropdown = PiceDropdown;
  PiceUI.dropdown = instance;
})();

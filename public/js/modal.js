// core/js/modal.js
// piceUI v2 modal plugin.

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

  class PiceModal extends BasePlugin {
    constructor(element, options) {
      super(element || document, options);
      this.openClass = "is-open";
      this.toggleSelector = "[data-modal-toggle]";
      this.closeSelector = "[data-modal-close]";
      this.backdropSelector = "[data-modal-backdrop]";
      this.onDocumentClick = this.handleDocumentClick.bind(this);
      this.onDocumentKeydown = this.handleDocumentKeydown.bind(this);
    }

    init() {
      if (this.initialized) return this;
      if (super.init) super.init();

      this.on(document, "click", this.onDocumentClick);
      this.on(document, "keydown", this.onDocumentKeydown);

      return this;
    }

    getTargetFromToggle(toggle) {
      const selector = toggle.getAttribute("data-modal-target") || toggle.getAttribute("data-modal-toggle");
      if (!selector || selector === "") return null;
      return document.querySelector(selector);
    }

    getOpenModal() {
      return document.querySelector(`.modal.${this.openClass}`);
    }

    open(modal) {
      if (!modal) return;

      modal.classList.add(this.openClass);
      modal.setAttribute("aria-hidden", "false");
      document.body.style.overflow = "hidden";

      const firstFocusable = modal.querySelector("button, [href], input, select, textarea, [tabindex]:not([tabindex='-1'])");
      if (firstFocusable) firstFocusable.focus();

      this.el = modal;
      this.emit("pui:modal:open", { modal });
    }

    close(modal) {
      if (!modal) return;

      modal.classList.remove(this.openClass);
      modal.setAttribute("aria-hidden", "true");

      if (!this.getOpenModal()) document.body.style.overflow = "";

      this.el = modal;
      this.emit("pui:modal:close", { modal });
    }

    toggle(modal) {
      if (!modal) return;
      if (modal.classList.contains(this.openClass)) this.close(modal);
      else this.open(modal);
    }

    handleDocumentClick(event) {
      const toggle = event.target.closest(this.toggleSelector);
      if (toggle) {
        const modal = this.getTargetFromToggle(toggle);
        this.toggle(modal);
        event.preventDefault();
        return;
      }

      const close = event.target.closest(this.closeSelector);
      if (close) {
        this.close(close.closest(".modal"));
        event.preventDefault();
        return;
      }

      const backdrop = event.target.closest(this.backdropSelector);
      if (backdrop) {
        this.close(backdrop.closest(".modal"));
      }
    }

    handleDocumentKeydown(event) {
      if (event.key !== "Escape") return;
      this.close(this.getOpenModal());
    }
  }

  const instance = new PiceModal(document).init();

  PiceUI.Modal = PiceModal;
  PiceUI.modal = instance;
})();

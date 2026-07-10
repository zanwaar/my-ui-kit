// core/js/plugins/base.js
// Base class for piceUI v2 vanilla plugins.

(function () {
  const PiceUI = (window.PiceUI = window.PiceUI || {});

  class PicePlugin {
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
      if (!element) return null;

      element.addEventListener(eventName, handler, options);
      const cleanup = function () {
        element.removeEventListener(eventName, handler, options);
      };

      this.cleanups.push(cleanup);
      return cleanup;
    }

    emit(name, detail) {
      if (!this.el || !PiceUI.events) return null;
      return PiceUI.events.emit(this.el, name, detail);
    }

    destroy() {
      this.cleanups.forEach(function (cleanup) {
        cleanup();
      });
      this.cleanups = [];
      this.initialized = false;
    }
  }

  PiceUI.Plugin = PicePlugin;
})();

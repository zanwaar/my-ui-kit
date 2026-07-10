// core/js/utils/dom.js
// Small DOM helpers for piceUI vanilla plugins.

(function () {
  const PiceUI = (window.PiceUI = window.PiceUI || {});

  PiceUI.dom = {
    ready(callback) {
      if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", callback, { once: true });
      } else {
        callback();
      }
    },

    qs(selector, scope) {
      return (scope || document).querySelector(selector);
    },

    qsa(selector, scope) {
      return Array.from((scope || document).querySelectorAll(selector));
    },

    closest(target, selector) {
      return target && target.closest ? target.closest(selector) : null;
    }
  };
})();

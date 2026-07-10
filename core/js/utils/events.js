// core/js/utils/events.js
// Small event helpers for piceUI vanilla plugins.

(function () {
  const PiceUI = (window.PiceUI = window.PiceUI || {});

  PiceUI.events = {
    emit(element, name, detail) {
      const event = new CustomEvent(name, {
        detail: detail || {},
        bubbles: true,
        cancelable: true
      });

      element.dispatchEvent(event);
      return event;
    },

    on(element, eventName, handler, options) {
      element.addEventListener(eventName, handler, options);
      return function off() {
        element.removeEventListener(eventName, handler, options);
      };
    }
  };
})();

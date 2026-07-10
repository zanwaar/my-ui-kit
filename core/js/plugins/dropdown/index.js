// core/js/plugins/dropdown/index.js
// Compatibility layer for historical dropdown plugin path.

(function () {
  if (window.PuiDropdown) {
    window.HSDropdown = window.PuiDropdown;
  }
})();

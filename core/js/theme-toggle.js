// core/js/theme-toggle.js
// Vanilla JS, tanpa dependency — toggle class "dark" di <html>.
// Pasang tombol dengan atribut [data-theme-toggle] di HTML mana pun.

(function () {
  const STORAGE_KEY = "ui-kit-theme";
  const root = document.documentElement;

  function applyTheme(theme) {
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }

  // Load preferensi tersimpan, atau ikuti preferensi sistem
  const saved = localStorage.getItem(STORAGE_KEY);
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  applyTheme(saved || (prefersDark ? "dark" : "light"));

  document.addEventListener("click", function (e) {
    const btn = e.target.closest("[data-theme-toggle]");
    if (!btn) return;

    const isDark = root.classList.contains("dark");
    const next = isDark ? "light" : "dark";
    applyTheme(next);
    localStorage.setItem(STORAGE_KEY, next);
  });
})();

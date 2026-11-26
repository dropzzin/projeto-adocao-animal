

(function () {
  const STORAGE_KEY = "theme";
  const DARK_CLASS = "dark";
  const ROOT = document.documentElement;

  function getToggleButton() {
    return (
      document.getElementById("theme-toggle") ||
      document.querySelector("[data-theme-toggle]")
    );
  }

  function getPreferredTheme() {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === "light" || saved === "dark") return saved;
    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  }

  function applyTheme(theme) {
    if (theme === "dark") {
      ROOT.classList.add(DARK_CLASS);
    } else {
      ROOT.classList.remove(DARK_CLASS);
    }

    const btn = getToggleButton();
    if (btn) {
      const isDark = theme === "dark";
      btn.setAttribute("aria-label", isDark ? "Mudar para modo claro" : "Mudar para modo escuro");
      btn.setAttribute("aria-pressed", isDark);

      if (btn.textContent.trim() === "🌙" || btn.textContent.trim() === "☀️") {
        btn.textContent = isDark ? "☀️" : "🌙";
      }
    }
  }

  function toggleTheme() {
    const current = ROOT.classList.contains(DARK_CLASS) ? "dark" : "light";
    const next = current === "dark" ? "light" : "dark";
    localStorage.setItem(STORAGE_KEY, next);
    applyTheme(next);
  }

  function init() {
    const theme = getPreferredTheme();
    applyTheme(theme);

    const btn = getToggleButton();
    if (btn) {
      btn.addEventListener("click", toggleTheme);
    }

    window
      .matchMedia("(prefers-color-scheme: dark)")
      .addEventListener("change", (e) => {
        if (!localStorage.getItem(STORAGE_KEY)) {
          applyTheme(e.matches ? "dark" : "light");
        }
      });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

  window.DarkMode = {
    toggle: toggleTheme,
    set: (theme) => {
      if (theme === "light" || theme === "dark") {
        localStorage.setItem(STORAGE_KEY, theme);
        applyTheme(theme);
      } else if (theme === "system") {
        localStorage.removeItem(STORAGE_KEY);
        applyTheme(getPreferredTheme());
      }
    },
    get: () => (ROOT.classList.contains(DARK_CLASS) ? "dark" : "light"),
  };
})();

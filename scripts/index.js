document.addEventListener("DOMContentLoaded", () => {
  const themeToggle = document.getElementById("theme-toggle");
  if (themeToggle) {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "light") {
      document.documentElement.classList.add("light");
      themeToggle.textContent = "☀️";
      themeToggle.setAttribute("aria-pressed", "true");
      themeToggle.setAttribute("aria-label", "Switch to dark mode");
    }

    themeToggle.addEventListener("click", () => {
      const isLight = document.documentElement.classList.toggle("light");
      themeToggle.textContent = isLight ? "☀️" : "🌙";
      themeToggle.setAttribute("aria-pressed", isLight.toString());
      themeToggle.setAttribute("aria-label", isLight ? "Switch to dark mode" : "Switch to light mode");
      localStorage.setItem("theme", isLight ? "light" : "dark");
    }, { passive: true });
  }

  // Intersection Observer for reveal animations
  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    document.querySelectorAll('.reveal').forEach(el => {
      revealObserver.observe(el);
    });
  }
});

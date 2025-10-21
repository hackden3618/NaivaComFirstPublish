document.addEventListener("DOMContentLoaded", () => {
  const toggle = document.querySelector('[data-toggle="nav"]');
  const header = document.querySelector("header");
  const navList = document.querySelector(".navList");

  if (!toggle || !header || !navList) return;

  const closeMenu = () => {
    toggle.setAttribute("aria-expanded", "false");
    header.removeAttribute("aria-expanded");
    toggle.setAttribute("aria-label", "Open menu");
  };

  const openMenu = () => {
    toggle.setAttribute("aria-expanded", "true");
    header.setAttribute("aria-expanded", "true");
    toggle.setAttribute("aria-label", "Close menu");
  };

  toggle.addEventListener("click", (e) => {
    const expanded = toggle.getAttribute("aria-expanded") === "true";
    if (expanded) closeMenu();
    else openMenu();
  });

  // close on outside click
  document.addEventListener("click", (e) => {
    if (!header.contains(e.target)) closeMenu();
  });

  // close on escape
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeMenu();
  });
});

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

/* Simple MVC for Services and Testimonials */
const App = (() => {
  // Models
  const servicesModel = [];
  const testimonialsModel = [];
  const teamModel = [];
  const projectsModel = [];

  // Views
  function renderServices(containerId = "services-list") {
    const container = document.getElementById(containerId);
    if (!container) return;
    container.innerHTML = "";
    servicesModel.forEach((s, i) => {
      const cardWrap = document.createElement("div");
      cardWrap.className = "svsItem reveal";
      cardWrap.style.animationDelay = i * 60 + "ms";
      const card = document.createElement("article");
      card.className = "card";
      card.innerHTML = `
        ${
          s.image
            ? `<img src="${s.image}" alt="${escapeHtml(
                s.title
              )}" loading="lazy"/>`
            : ""
        }
        <div class="card-body">
          <h3>${escapeHtml(s.title)}</h3>
          <p class="muted">${escapeHtml(s.description)}</p>
        </div>`;
      cardWrap.appendChild(card);
      container.appendChild(cardWrap);
    });
  }

  function renderTestimonials(containerId = "testimonials-list") {
    const container = document.getElementById(containerId);
    if (!container) return;
    container.innerHTML = "";
    let changed = false;
    testimonialsModel.forEach((t, i) => {
      // ensure there is a numeric rating 0-100; if missing, generate a random one and persist
      if (
        typeof t.rating === "undefined" ||
        t.rating === null ||
        isNaN(Number(t.rating))
      ) {
        t.rating = Math.floor(Math.random() * 36) + 60; // random 60-95
        changed = true;
      }

      const node = document.createElement("article");
      node.className = "testimonial-card tweet-style reveal";
      node.style.animationDelay = i * 70 + "ms";

      // compute star rating from stored rating (0-100) -> 0-5 scale
      const score = Number(t.rating || 0);
      const normalized = Math.max(0, Math.min(100, score)) / 10; // 0-10
      const starsRounded = Math.round(normalized / 2); // 0-5 integer
      const full = starsRounded;
      const empty = 5 - full;
      const starStr = "★".repeat(full) + "☆".repeat(empty);

      node.innerHTML = `
        <div class="tweet">
          <img class="avatar" src="${escapeHtml(
            t.avatar || "images/icons/default-avatar.svg"
          )}" alt="${escapeHtml(t.name)} avatar" />
          <div class="tweet-body">
            <div class="tweet-header"><strong>${escapeHtml(
              t.name
            )}</strong> <span class="role">${escapeHtml(
        t.role || ""
      )}</span> <span class="rating">${starStr} <small class="muted">(${(
        Math.round((normalized / 2) * 10) / 10
      ).toFixed(1)}/5)</small></span></div>
            <p class="quote">${escapeHtml(t.comment)}</p>
          </div>
        </div>`;
      container.appendChild(node);
    });
    if (changed) save();
  }

  function renderProjects(containerId = "projects-list") {
    const container = document.getElementById(containerId);
    if (!container) return;
    container.innerHTML = "";
    projectsModel.forEach((p, i) => {
      const wrap = document.createElement("div");
      wrap.className = "svsItem reveal";
      wrap.style.animationDelay = i * 60 + "ms";
      const card = document.createElement("article");
      card.className = "card";
      card.innerHTML = `
        ${
          p.image
            ? `<img src="${p.image}" alt="${escapeHtml(
                p.title
              )}" loading="lazy"/>`
            : ""
        }
        <div class="card-body">
          <h3>${escapeHtml(p.title)}</h3>
          <p class="muted">${escapeHtml(p.description || "")}</p>
          ${
            p.link
              ? `<p><a href="${escapeHtml(
                  p.link
                )}" target="_blank" rel="noopener" class="button-like">View Project</a></p>`
              : ""
          }
        </div>`;
      wrap.appendChild(card);
      container.appendChild(wrap);
    });
  }

  function renderTeam(containerId = "team-list") {
    const container = document.getElementById(containerId);
    if (!container) return;
    container.innerHTML = "";
    teamModel.forEach((m, i) => {
      const row = document.createElement("div");
      row.className = "team-card reveal";
      row.style.animationDelay = i * 60 + "ms";
      row.innerHTML = `<img class="team-thumb" src="${escapeHtml(
        m.avatar || "images/icons/default-avatar.svg"
      )}" alt="${escapeHtml(
        m.name
      )}"/><div class="team-info"><strong>${escapeHtml(
        m.name
      )}</strong><div class="team-role">${escapeHtml(
        m.role || ""
      )}</div></div>`;
      container.appendChild(row);
    });
  }

  // Controller
  function addService(item) {
    servicesModel.push(item);
    renderServices();
    save();
  }
  function setServices(items) {
    servicesModel.length = 0;
    servicesModel.push(...items);
    renderServices();
    save();
  }
  function addTestimonial(item) {
    testimonialsModel.push(item);
    renderTestimonials();
    save();
  }
  function addProject(item) {
    projectsModel.push(item);
    renderProjects();
    save();
  }
  function setProjects(items) {
    projectsModel.length = 0;
    projectsModel.push(...items);
    renderProjects();
    save();
  }
  function addTeam(item) {
    teamModel.push(item);
    renderTeam();
    save();
  }
  function setTeam(items) {
    teamModel.length = 0;
    teamModel.push(...items);
    renderTeam();
    save();
  }
  function updateTeam(item) {
    const idx = teamModel.findIndex((t) => t.id === item.id);
    if (idx > -1) {
      teamModel[idx] = Object.assign({}, teamModel[idx], item);
      save();
      renderTeam();
    }
  }
  function setTestimonials(items) {
    testimonialsModel.length = 0;
    testimonialsModel.push(...items);
    renderTestimonials();
    save();
  }

  // storage
  function save() {
    try {
      localStorage.setItem("naivacom-services", JSON.stringify(servicesModel));
      localStorage.setItem(
        "naivacom-testimonials",
        JSON.stringify(testimonialsModel)
      );
      localStorage.setItem("naivacom-projects", JSON.stringify(projectsModel));
      localStorage.setItem("naivacom-team", JSON.stringify(teamModel));
    } catch (e) {
      console.warn("Could not save data", e);
    }
  }

  function load() {
    try {
      const s = JSON.parse(localStorage.getItem("naivacom-services") || "null");
      const t = JSON.parse(
        localStorage.getItem("naivacom-testimonials") || "null"
      );
      const p = JSON.parse(localStorage.getItem("naivacom-projects") || "null");
      if (Array.isArray(s) && s.length) {
        servicesModel.length = 0;
        servicesModel.push(...s);
      }
      if (Array.isArray(t) && t.length) {
        testimonialsModel.length = 0;
        testimonialsModel.push(...t);
      }
      if (Array.isArray(p) && p.length) {
        projectsModel.length = 0;
        projectsModel.push(...p);
      }
      const tm = JSON.parse(localStorage.getItem("naivacom-team") || "null");
      if (Array.isArray(tm) && tm.length) {
        teamModel.length = 0;
        teamModel.push(...tm);
      }
    } catch (e) {
      console.warn("Could not load stored data", e);
    }
  }

  // Utilities
  function escapeHtml(str) {
    if (!str) return "";
    return String(str).replace(
      /[&<>"']/g,
      (s) =>
        ({
          "&": "&amp;",
          "<": "&lt;",
          ">": "&gt;",
          '"': "&quot;",
          "'": "&#39;",
        }[s])
    );
  }

  // initial sample data
  const sampleServices = [
    {
      id: 1,
      title: "Custom Web Development",
      description:
        "Responsive, accessible, and scalable web apps built to your spec.",
      image: "images/webDevcard.webp",
    },
    {
      id: 2,
      title: "UI / UX Design",
      description:
        "Design systems and interfaces that convert users into customers.",
      image: "images/webDevcard.webp",
    },
    {
      id: 3,
      title: "E-commerce Solutions",
      description:
        "Secure online stores with payment integrations and analytics.",
      image: "images/webDevcard.webp",
    },
    {
      id: 4,
      title: "Performance & SEO",
      description:
        "Speed, optimization, and search improvements that drive traffic.",
      image: "images/webDevcard.webp",
    },
  ];

  const sampleTestimonials = [
    {
      id: 1,
      name: "Aisha Mwangi",
      role: "Founder, Acme Foods",
      comment:
        "NaivaCom delivered a modern store that increased online orders by 83%, communication and delivery were excellent.",
    },
    {
      id: 2,
      name: "John Otieno",
      role: "CTO, Atlas Logistics",
      comment:
        "Their team rebuilt our dashboard with clear UX improvements and measurable performance gains.",
    },
    {
      id: 3,
      name: "Marta Kimani",
      role: "Marketing Lead, BrightMedia",
      comment:
        "Professional, timely and strategic, our conversion rate improved after the redesign.",
    },
  ];
  const sampleProjects = [
    {
      id: 1,
      title: "NaivaCom Portfolio Site",
      description:
        "A responsive marketing site built with performance in mind.",
      image: "images/webDevcard.webp",
      link: "#",
    },
    {
      id: 2,
      title: "E-commerce Demo",
      description: "A secure demo storefront with payment integration.",
      image: "images/webDevcard.webp",
      link: "#",
    },
  ];

  // public API
  return {
    init() {
      load();
      // if no saved data, seed with samples
      if (!servicesModel.length) setServices(sampleServices);
      else renderServices();
      if (!testimonialsModel.length) setTestimonials(sampleTestimonials);
      else renderTestimonials();
      if (!projectsModel.length) setProjects(sampleProjects);
      else renderProjects();
    },
    addService,
    addTestimonial,
    addProject,
    setServices,
    setTestimonials,
    setProjects,
    getServices: () => servicesModel.slice(),
    getTestimonials: () => testimonialsModel.slice(),
    getProjects: () => projectsModel.slice(),
    getTeams: () => teamModel.slice(),
    deleteService(id) {
      const idx = servicesModel.findIndex((s) => s.id === id);
      if (idx > -1) {
        servicesModel.splice(idx, 1);
        save();
        renderServices();
      }
    },
    deleteTestimonial(id) {
      const idx = testimonialsModel.findIndex((t) => t.id === id);
      if (idx > -1) {
        testimonialsModel.splice(idx, 1);
        save();
        renderTestimonials();
      }
    },
    deleteProject(id) {
      const idx = projectsModel.findIndex((p) => p.id === id);
      if (idx > -1) {
        projectsModel.splice(idx, 1);
        save();
        renderProjects();
      }
    },
    deleteTeam(id) {
      const idx = teamModel.findIndex((t) => t.id === id);
      if (idx > -1) {
        teamModel.splice(idx, 1);
        save();
        renderTeam();
      }
    },
    addTeam,
    updateTeam,
    setTeam,
  };
})();

// auto-init
document.addEventListener("DOMContentLoaded", () => {
  App.init();
});

// Theme toggle: add light mode support and persist preference
(function themeToggle() {
  const btn = document.getElementById("theme-toggle");
  if (!btn) return;
  const root = document.documentElement;

  function applyTheme(theme) {
    if (theme === "light") {
      root.classList.add("light");
      btn.textContent = "☀️";
      btn.setAttribute("aria-pressed", "true");
      btn.setAttribute("aria-label", "Switch to dark mode");
    } else {
      root.classList.remove("light");
      btn.textContent = "🌙";
      btn.setAttribute("aria-pressed", "false");
      btn.setAttribute("aria-label", "Switch to light mode");
    }
  }

  // load saved preference
  const saved = localStorage.getItem("naivacom-theme");
  if (saved) applyTheme(saved);

  btn.addEventListener("click", () => {
    const isLight = root.classList.contains("light");
    const next = isLight ? "dark" : "light";
    applyTheme(next);
    localStorage.setItem("naivacom-theme", next);
  });
})();

/* UX Improvements: lazy-load hero video and smooth-scroll */
(function heroVideoLazy() {
  const vid = document.getElementById("hero-video");
  if (!vid) return;

  // choose video source based on devicePixelRatio and network
  const dpr = window.devicePixelRatio || 1;
  const connection =
    navigator.connection ||
    navigator.mozConnection ||
    navigator.webkitConnection ||
    {};
  const saveData = connection.saveData || false;
  let preferHigh = dpr >= 2 && !saveData;

  const sources = [];
  // prefer 4k for high DPR on good connections
  if (preferHigh) {
    sources.push({
      src: "videos/demonstrationVideo_4k.mp4",
      type: "video/mp4",
    });
  }
  // fallback HD
  sources.push({
    src: "videos/demonstrationVideo_1080.mp4",
    type: "video/mp4",
  });

  // IntersectionObserver to lazy-load when hero is visible
  const obs = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          // load the first existing source
          (async () => {
            for (const s of sources) {
              try {
                // quick existence check via fetch HEAD for same-origin
                const res = await fetch(s.src, { method: "HEAD" });
                if (res && res.ok) {
                  const sourceEl = document.createElement("source");
                  sourceEl.src = s.src;
                  sourceEl.type = s.type;
                  vid.appendChild(sourceEl);
                  vid.load();
                  break;
                }
              } catch (e) {
                /* ignore and try next */
              }
            }
          })();
          obs.disconnect();
        }
      });
    },
    { rootMargin: "200px" }
  );

  obs.observe(vid);

  // Smooth scroll for anchor clicks
  if ("scrollBehavior" in document.documentElement.style) {
    document.documentElement.style.scrollBehavior = "smooth";
  }

  // Respect prefers-reduced-motion
  const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
  if (mediaQuery.matches) {
    document.documentElement.style.scrollBehavior = "auto";
  }
})();

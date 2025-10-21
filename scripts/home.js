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

  // Views
  function renderServices(containerId = "services-list") {
    const container = document.getElementById(containerId);
    if (!container) return;
    container.innerHTML = "";
    servicesModel.forEach((s) => {
      const card = document.createElement("article");
      card.className = "svsItem card";
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
      container.appendChild(card);
    });
  }

  function renderTestimonials(containerId = "testimonials-list") {
    const container = document.getElementById(containerId);
    if (!container) return;
    container.innerHTML = "";
    testimonialsModel.forEach((t) => {
      const node = document.createElement("blockquote");
      node.className = "testimonial-card";
      node.innerHTML = `
        <p class="quote">${escapeHtml(t.comment)}</p>
        <footer>
          <strong>${escapeHtml(t.name)}</strong>
          <span class="role">${escapeHtml(t.role)}</span>
        </footer>`;
      container.appendChild(node);
    });
  }

  // Controller
  function addService(item) {
    servicesModel.push(item);
    renderServices();
  }
  function setServices(items) {
    servicesModel.length = 0;
    servicesModel.push(...items);
    renderServices();
  }
  function addTestimonial(item) {
    testimonialsModel.push(item);
    renderTestimonials();
  }
  function setTestimonials(items) {
    testimonialsModel.length = 0;
    testimonialsModel.push(...items);
    renderTestimonials();
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
        "NaivaCom delivered a modern store that increased online orders by 83% — communication and delivery were excellent.",
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
        "Professional, timely and strategic — our conversion rate improved after the redesign.",
    },
  ];

  // public API
  return {
    init() {
      setServices(sampleServices);
      setTestimonials(sampleTestimonials);
    },
    addService,
    addTestimonial,
    setServices,
    setTestimonials,
  };
})();

// auto-init
document.addEventListener("DOMContentLoaded", () => {
  App.init();
});

// small admin wiring to App (exposed by scripts/home.js)
document.addEventListener("DOMContentLoaded", () => {
  // password gate logic
  const gate = document.getElementById("pw-gate");
  const pwForm = document.getElementById("pw-form");
  const pwInput = document.getElementById("pw-input");
  const pwError = document.getElementById("pw-error");
  const AUTH_KEY = "naivacom-admin-auth";

  function isAuthed() {
    return sessionStorage.getItem(AUTH_KEY) === "1";
  }
  function unlock() {
    gate.style.display = "none";
  }
  function lock() {
    gate.style.display = "flex";
  }

  if (isAuthed()) unlock();

  pwForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const val = pwInput.value || "";
    if (val === "komoKomo") {
      sessionStorage.setItem(AUTH_KEY, "1");
      unlock();
    } else {
      pwError.style.display = "block";
      pwError.textContent = "Wrong password";
      setTimeout(() => (pwError.style.display = "none"), 2000);
    }
  });

  const svcForm = document.getElementById("service-form");
  const svcList = document.getElementById("admin-services-list");
  const projForm = document.getElementById("project-form");
  const projList = document.getElementById("admin-projects-list");
  const testForm = document.getElementById("testimonial-form");
  const testList = document.getElementById("admin-testimonials-list");
  const clearBtn = document.getElementById("clear-data");
  const toggleEditBtn = document.getElementById("toggle-edit");
  const editStatus = document.getElementById("edit-status");

  // editing is disabled by default; require explicit enable
  let editEnabled = sessionStorage.getItem("naivacom-edit-enabled") === "1";

  function setEditMode(on) {
    editEnabled = !!on;
    sessionStorage.setItem("naivacom-edit-enabled", editEnabled ? "1" : "0");
    // enable/disable forms
    [svcForm, testForm, projForm].forEach((f) => {
      if (!f) return;
      Array.from(f.querySelectorAll("input,textarea,button")).forEach((el) => {
        // keep the toggle button unaffected
        if (el.id === "toggle-edit") return;
        el.disabled = !editEnabled;
      });
    });
    // show status
    editStatus.textContent = editEnabled
      ? "Editing enabled — you can add/delete content"
      : "Editing is disabled — view-only";
    toggleEditBtn.textContent = editEnabled
      ? "Disable Editing"
      : "Enable Editing";
    // show or hide delete buttons
    document.querySelectorAll(".row button[data-id]").forEach((b) => {
      b.style.display = editEnabled ? "inline-block" : "none";
    });
  }

  // initialize edit mode UI
  setEditMode(editEnabled);

  function renderLists() {
    svcList.innerHTML = "";
    (App.getServices() || []).forEach((s) => {
      const row = document.createElement("div");
      row.className = "row";
      row.innerHTML = `
              <div class="meta">
                <img class="thumb" src="${
                  s.image || "images/webDevcard.webp"
                }" alt="${s.title}"/>
                <div>
                  <strong>${s.title}</strong>
                  <div class="muted-small">${s.description || ""}</div>
                </div>
              </div>
              <div>
                <button class="viewBtn" data-type="service" data-id="${
                  s.id
                }">View</button>
                <button data-id="${s.id}">Delete</button>
              </div>`;
      svcList.appendChild(row);
    });

    testList.innerHTML = "";
    (App.getTestimonials() || []).forEach((t) => {
      const row = document.createElement("div");
      row.className = "row";
      row.innerHTML = `
              <div class="meta">
                <img class="thumb" src="${
                  t.avatar || "images/icons/default-avatar.svg"
                }" alt="${t.name}" />
                <div>
                  <strong>${t.name}</strong>
                  <div class="muted-small">${t.role || ""}</div>
                  <div class="muted-rating">Rating: ${t.rating || ""}</div>
                </div>
              </div>
              <div>
                <button class="viewBtn" data-type="testimonial" data-id="${
                  t.id
                }">View</button>
                <button data-id="${t.id}">Delete</button>
              </div>`;
      testList.appendChild(row);
    });

    projList.innerHTML = "";
    (App.getProjects() || []).forEach((p) => {
      const row = document.createElement("div");
      row.className = "row";
      row.innerHTML = `
              <div class="meta">
                <img class="thumb" src="${
                  p.image || "images/webDevcard.webp"
                }" alt="${p.title}"/>
                <div>
                  <strong>${p.title}</strong>
                  <div class="muted-small">${p.description || ""}</div>
                </div>
              </div>
              <div>
                <button class="viewBtn" data-type="project" data-id="${
                  p.id
                }">View</button>
                <button data-id="${p.id}">Delete</button>
              </div>`;
      projList.appendChild(row);
    });
  }

  svcForm.addEventListener("submit", (e) => {
    e.preventDefault();
    if (!editEnabled) {
      alert("Enable editing to add content");
      return;
    }
    if (!confirm("Confirm adding this service?")) return;
    const fd = new FormData(svcForm);
    const item = {
      id: Date.now(),
      title: fd.get("title"),
      image: fd.get("image") || "images/webDevcard.webp",
      description: fd.get("description"),
    };
    App.addService(item);
    svcForm.reset();
    renderLists();
  });

  testForm.addEventListener("submit", (e) => {
    e.preventDefault();
    if (!editEnabled) {
      alert("Enable editing to add content");
      return;
    }
    if (!confirm("Confirm adding this testimonial?")) return;
    const fd = new FormData(testForm);
    const rawRating = Number(fd.get("rating") || 0);
    const item = {
      id: Date.now(),
      name: fd.get("name"),
      role: fd.get("role"),
      avatar: fd.get("avatar") || "images/icons/default-avatar.png",
      rating: rawRating, // store 0-100
      comment: fd.get("comment"),
    };
    App.addTestimonial(item);
    testForm.reset();
    renderLists();
  });

  projForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const fd = new FormData(projForm);
    const item = {
      id: Date.now(),
      title: fd.get("title"),
      image: fd.get("image") || "images/webDevcard.webp",
      link: fd.get("link") || "",
      description: fd.get("description") || "",
    };
    App.addProject(item);
    projForm.reset();
    renderLists();
  });

  svcList.addEventListener("click", (e) => {
    const id = e.target.getAttribute("data-id");
    if (!id) return;
    if (!editEnabled) {
      alert("Enable editing to delete content");
      return;
    }
    if (!confirm("Delete this service? This action cannot be undone.")) return;
    App.deleteService(Number(id));
    renderLists();
  });
  testList.addEventListener("click", (e) => {
    const id = e.target.getAttribute("data-id");
    if (!id) return;
    if (!editEnabled) {
      alert("Enable editing to delete content");
      return;
    }
    if (!confirm("Delete this testimonial? This action cannot be undone."))
      return;
    App.deleteTestimonial(Number(id));
    renderLists();
  });
  projList.addEventListener("click", (e) => {
    const id = e.target.getAttribute("data-id");
    if (!id) return;
    if (!editEnabled) {
      alert("Enable editing to delete content");
      return;
    }
    if (!confirm("Delete this project? This action cannot be undone.")) return;
    App.deleteProject(Number(id));
    renderLists();
  });

  clearBtn.addEventListener("click", () => {
    if (confirm("Clear stored data?")) {
      localStorage.removeItem("naivacom-services");
      localStorage.removeItem("naivacom-testimonials");
      localStorage.removeItem("naivacom-projects");
      location.reload();
    }
  });

  // toggle edit permission button
  toggleEditBtn.addEventListener("click", () => {
    if (editEnabled) {
      if (confirm("Disable editing?")) setEditMode(false);
      return;
    }
    // require confirmation to enable edits
    if (
      confirm(
        "Enable editing — this will allow adding and deleting site content. Continue?"
      )
    ) {
      setEditMode(true);
    }
  });

  renderLists();

  // --- Create and wire a simple preview modal ---
  const modal = document.createElement("div");
  modal.id = "admin-view-modal";
  modal.innerHTML = `
          <div class="overlay" tabindex="-1"></div>
          <div class="dialog" role="dialog" aria-modal="true" aria-label="Content preview">
            <button class="closeBtn" aria-label="Close">Close</button>
            <img class="preview" src="" alt="preview image" />
            <div class="meta">
                <h3 class="title"></h3>
                <p class="desc"></p>
                <p class="extra"></p>
                <p class="externalLink-wrap"><a class="externalLink button-like" href="#" target="_blank" rel="noopener">Open link</a></p>
              </div>
          </div>`;
  document.body.appendChild(modal);

  const viewModal = document.getElementById("admin-view-modal");
  const viewPreview = viewModal.querySelector("img.preview");
  const viewTitle = viewModal.querySelector(".title");
  const viewDesc = viewModal.querySelector(".desc");
  const viewExtra = viewModal.querySelector(".extra");
  const viewLink = viewModal.querySelector(".externalLink");
  const closeBtn = viewModal.querySelector(".closeBtn");

  function openViewModal(type, id) {
    let data = null;
    if (type === "service") data = App.getServices().find((s) => s.id === id);
    if (type === "testimonial")
      data = App.getTestimonials().find((t) => t.id === id);
    if (type === "project") data = App.getProjects().find((p) => p.id === id);
    if (!data) return alert("Item not found");
    viewTitle.textContent = data.title || data.name || "Preview";
    viewDesc.textContent = data.description || data.comment || "";
    viewExtra.textContent = data.role ? `Role: ${data.role}` : "";
    // if testimonial, show avatar in preview
    if (type === "testimonial" && data.avatar) {
      viewPreview.src = data.avatar;
      viewPreview.style.display = "";
    } else if (data.image) {
      viewPreview.src = data.image;
      viewPreview.style.display = "";
    } else {
      viewPreview.style.display = "none";
    }
    if (data.link) {
      viewLink.href = data.link;
      viewLink.style.display = "inline-block";
    } else {
      viewLink.style.display = "none";
    }
    // if testimonial, append rating stars to extra
    if (type === "testimonial") {
      const score = Number(data.rating || 0);
      const normalized = Math.max(0, Math.min(100, score)) / 10; // 0-10
      const stars = Math.round((normalized / 2) * 2) / 2; // 0-5 steps
      const full = Math.floor(stars);
      const half = stars - full >= 0.5 ? 1 : 0;
      const empty = 5 - full - half;
      const starStr = "★".repeat(full) + (half ? "☆" : "") + "☆".repeat(empty);
      viewExtra.textContent =
        (data.role ? `Role: ${data.role} ` : "") +
        " " +
        starStr +
        ` (${(Math.round((normalized / 2) * 10) / 10).toFixed(1)}/5)`;
    }
    viewModal.style.display = "flex";
    closeBtn.focus();
  }

  function closeViewModal() {
    viewModal.style.display = "none";
  }
  closeBtn.addEventListener("click", closeViewModal);
  viewModal.querySelector(".overlay").addEventListener("click", closeViewModal);
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeViewModal();
  });

  // delegated click for view buttons
  document.body.addEventListener("click", (e) => {
    const btn = e.target.closest(".viewBtn");
    if (!btn) return;
    const type = btn.getAttribute("data-type");
    const id = Number(btn.getAttribute("data-id"));
    openViewModal(type, id);
  });
});

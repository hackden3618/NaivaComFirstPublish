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
    if (gate) gate.style.display = "none";
  }
  function lock() {
    if (gate) gate.style.display = "flex";
  }

  if (isAuthed()) unlock();

  if (pwForm) {
    pwForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const val = pwInput.value || "";
      if (val === "komoKomo") {
        sessionStorage.setItem(AUTH_KEY, "1");
        unlock();
      } else {
        if (pwError) pwError.style.display = "block";
        if (pwError) pwError.textContent = "Wrong password";
        setTimeout(() => pwError && (pwError.style.display = "none"), 2000);
      }
    });
  }

  const svcForm = document.getElementById("service-form");
  const svcList = document.getElementById("admin-services-list");
  const projForm = document.getElementById("project-form");
  const projList = document.getElementById("admin-projects-list");
  const testForm = document.getElementById("testimonial-form");
  const testList = document.getElementById("admin-testimonials-list");

  // Team management elements: inject a small team section if not present
  const teamForm = (function createTeamForm() {
    const existing = document.getElementById("admin-team");
    if (existing) return existing.querySelector("#team-form");
    const sec = document.createElement("section");
    sec.id = "admin-team";
    sec.innerHTML = `
      <h2>Employ / Lay Off team</h2>
      <form id="team-form">
        <input name="name" placeholder="Full name" required />
        <input name="role" placeholder="Role / Title" />
        <input name="avatar" placeholder="Avatar image path (optional)" />
        <input name="portfolio" placeholder="Portfolio URL (optional)" />
        <textarea name="bio" placeholder="Short bio (optional)"></textarea>
        <button type="submit">Hire / Add team member</button>
      </form>
      <div class="list" id="admin-team-list"></div>
    `;
    const main = document.querySelector("main") || document.body;
    const clearBtnNode = document.getElementById("clear-data");
    if (clearBtnNode && main.contains(clearBtnNode))
      main.insertBefore(sec, clearBtnNode);
    else main.appendChild(sec);
    return document.getElementById("team-form");
  })();
  const teamList = document.getElementById("admin-team-list");
  const clearBtn = document.getElementById("clear-data");
  const toggleEditBtn = document.getElementById("toggle-edit");
  const editStatus = document.getElementById("edit-status");

  // editing is disabled by default; require explicit enable
  let editEnabled = sessionStorage.getItem("naivacom-edit-enabled") === "1";

  function setEditMode(on) {
    editEnabled = !!on;
    sessionStorage.setItem("naivacom-edit-enabled", editEnabled ? "1" : "0");
    // enable/disable forms
    [svcForm, testForm, projForm, teamForm].forEach((f) => {
      if (!f) return;
      Array.from(f.querySelectorAll("input,textarea,button")).forEach((el) => {
        if (el.id === "toggle-edit") return;
        el.disabled = !editEnabled;
      });
    });
    if (editStatus)
      editStatus.textContent = editEnabled
        ? "Editing enabled"
        : "Editing disabled";
  }

  // render lists for admin area (services, testimonials, projects, team)
  function renderLists() {
    // team list
    if (teamList && typeof App !== "undefined" && App.getTeams) {
      teamList.innerHTML = "";
      (App.getTeams() || []).forEach((m) => {
        const row = document.createElement("div");
        row.className = "row";
        row.innerHTML = `
          <div class="meta">
            <img class="thumb" src="${
              m.avatar || "images/icons/default-avatar.svg"
            }" alt="${m.name}" />
            <div>
              <strong>${m.name}</strong>
              <div class="muted-small">${m.role || ""}</div>
            </div>
          </div>
          <div>
            <button class="viewBtn" data-type="team" data-id="${
              m.id
            }">View</button>
            <button data-action="edit" data-type="team" data-id="${
              m.id
            }">Edit</button>
            <button data-action="delete" data-type="team" data-id="${
              m.id
            }">Delete</button>
          </div>`;
        teamList.appendChild(row);
      });
    }

    // services
    if (svcList && typeof App !== "undefined" && App.getServices) {
      svcList.innerHTML = "";
      (App.getServices() || []).forEach((s) => {
        const row = document.createElement("div");
        row.className = "row";
        row.innerHTML = `
          <div class="meta">
            <img class="thumb" src="${
              s.image || "images/webDevcard.webp"
            }" alt="${s.title}" />
            <div>
              <strong>${s.title}</strong>
              <div class="muted-small">${s.description || ""}</div>
            </div>
          </div>
          <div>
            <button class="viewBtn" data-type="service" data-id="${
              s.id
            }">View</button>
            <button data-action="delete" data-type="service" data-id="${
              s.id
            }">Delete</button>
          </div>`;
        svcList.appendChild(row);
      });
    }

    // testimonials
    if (testList && typeof App !== "undefined" && App.getTestimonials) {
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
            <button data-action="delete" data-type="testimonial" data-id="${
              t.id
            }">Delete</button>
          </div>`;
        testList.appendChild(row);
      });
    }

    // projects
    if (projList && typeof App !== "undefined" && App.getProjects) {
      projList.innerHTML = "";
      (App.getProjects() || []).forEach((p) => {
        const row = document.createElement("div");
        row.className = "row";
        row.innerHTML = `
          <div class="meta">
            <img class="thumb" src="${
              p.image || "images/webDevcard.webp"
            }" alt="${p.title}" />
            <div>
              <strong>${p.title}</strong>
              <div class="muted-small">${p.description || ""}</div>
            </div>
          </div>
          <div>
            <button class="viewBtn" data-type="project" data-id="${
              p.id
            }">View</button>
            <button data-action="delete" data-type="project" data-id="${
              p.id
            }">Delete</button>
          </div>`;
        projList.appendChild(row);
      });
    }
  }

  // wire team form submit
  if (teamForm) {
    teamForm.addEventListener("submit", (e) => {
      e.preventDefault();
      if (!editEnabled) return alert("Enable editing to add content");
      if (!confirm("Confirm adding this team member?")) return;
      const fd = new FormData(teamForm);
      const item = {
        id: Date.now(),
        name: fd.get("name"),
        role: fd.get("role") || "",
        avatar: fd.get("avatar") || "images/icons/default-avatar.svg",
        portfolio: fd.get("portfolio") || "",
        bio: fd.get("bio") || "",
      };
      if (typeof App !== "undefined" && App.addTeam) App.addTeam(item);
      teamForm.reset();
      renderLists();
    });
  }

  // general delegated clicks for edit/delete/view actions
  document.body.addEventListener("click", (e) => {
    const btn = e.target.closest("button");
    if (!btn) return;
    const action = btn.getAttribute("data-action");
    const type = btn.getAttribute("data-type");
    const id = Number(btn.getAttribute("data-id"));
    // view buttons handled by separate class
    if (btn.classList.contains("viewBtn")) return;
    if (!action || !type || !id) return;
    if (!editEnabled && action !== "view")
      return alert("Enable editing to perform this action");

    if (action === "delete") {
      if (!confirm("Delete this item? This cannot be undone.")) return;
      if (type === "team" && App.deleteTeam) App.deleteTeam(id);
      if (type === "service" && App.deleteService) App.deleteService(id);
      if (type === "testimonial" && App.deleteTestimonial)
        App.deleteTestimonial(id);
      if (type === "project" && App.deleteProject) App.deleteProject(id);
      renderLists();
      return;
    }

    if (action === "edit") {
      // simple prompt-based edit to keep UI small
      if (type === "team" && App.getTeams && App.updateTeam) {
        const current = App.getTeams().find((t) => t.id === id);
        if (!current) return alert("Team member not found");
        const name = prompt("Name:", current.name) || current.name;
        const role = prompt("Role:", current.role || "") || current.role;
        const avatar =
          prompt("Avatar URL:", current.avatar || "") || current.avatar;
        const portfolio =
          prompt("Portfolio URL:", current.portfolio || "") ||
          current.portfolio;
        const bio = prompt("Short bio:", current.bio || "") || current.bio;
        const updated = Object.assign({}, current, {
          name,
          role,
          avatar,
          portfolio,
          bio,
        });
        App.updateTeam(updated.id, updated);
        renderLists();
      }
      // other types could use similar prompts if needed
    }
  });

  // make view modal
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
    if (type === "service" && App.getServices)
      data = App.getServices().find((s) => s.id === id);
    if (type === "testimonial" && App.getTestimonials)
      data = App.getTestimonials().find((t) => t.id === id);
    if (type === "project" && App.getProjects)
      data = App.getProjects().find((p) => p.id === id);
    if (type === "team" && App.getTeams)
      data = App.getTeams().find((m) => m.id === id);
    if (!data) return alert("Item not found");
    viewTitle.textContent = data.title || data.name || "Preview";
    viewDesc.textContent = data.description || data.comment || data.bio || "";
    viewExtra.textContent = data.role ? `Role: ${data.role}` : "";
    if (data.avatar) {
      viewPreview.src = data.avatar;
      viewPreview.style.display = "";
    } else if (data.image) {
      viewPreview.src = data.image;
      viewPreview.style.display = "";
    } else {
      viewPreview.style.display = "none";
    }
    if (data.link || data.portfolio) {
      viewLink.href = data.link || data.portfolio;
      viewLink.style.display = "inline-block";
    } else {
      viewLink.style.display = "none";
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

  // wire up other form handlers (services/testimonials/projects) if present
  if (svcForm) {
    svcForm.addEventListener("submit", (e) => {
      e.preventDefault();
      if (!editEnabled) return alert("Enable editing to add content");
      if (!confirm("Confirm adding this service?")) return;
      const fd = new FormData(svcForm);
      const item = {
        id: Date.now(),
        title: fd.get("title"),
        image: fd.get("image") || "images/webDevcard.webp",
        description: fd.get("description"),
      };
      if (App.addService) App.addService(item);
      svcForm.reset();
      renderLists();
    });
  }

  if (testForm) {
    testForm.addEventListener("submit", (e) => {
      e.preventDefault();
      if (!editEnabled) return alert("Enable editing to add content");
      if (!confirm("Confirm adding this testimonial?")) return;
      const fd = new FormData(testForm);
      const rawRating = Number(fd.get("rating") || 0);
      const item = {
        id: Date.now(),
        name: fd.get("name"),
        role: fd.get("role"),
        avatar: fd.get("avatar") || "images/icons/default-avatar.png",
        rating: rawRating,
        comment: fd.get("comment"),
      };
      if (App.addTestimonial) App.addTestimonial(item);
      testForm.reset();
      renderLists();
    });
  }

  if (projForm) {
    projForm.addEventListener("submit", (e) => {
      e.preventDefault();
      if (!editEnabled) return alert("Enable editing to add content");
      const fd = new FormData(projForm);
      const item = {
        id: Date.now(),
        title: fd.get("title"),
        image: fd.get("image") || "images/webDevcard.webp",
        link: fd.get("link") || "",
        description: fd.get("description") || "",
      };
      if (App.addProject) App.addProject(item);
      projForm.reset();
      renderLists();
    });
  }

  // delegated delete/edit for svc/test/proj/team via data-action above (handled earlier)

  if (clearBtn) {
    clearBtn.addEventListener("click", () => {
      if (confirm("Clear stored data?")) {
        localStorage.removeItem("naivacom-services");
        localStorage.removeItem("naivacom-testimonials");
        localStorage.removeItem("naivacom-projects");
        localStorage.removeItem("naivacom-team");
        location.reload();
      }
    });
  }

  if (toggleEditBtn) {
    toggleEditBtn.addEventListener("click", () => {
      if (editEnabled) {
        if (confirm("Disable editing?")) setEditMode(false);
        return;
      }
      if (
        confirm(
          "Enable editing — this will allow adding and deleting site content. Continue?"
        )
      ) {
        setEditMode(true);
      }
    });
  }

  renderLists();
});

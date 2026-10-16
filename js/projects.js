const projectContainer = document.querySelector("[data-projects]");

if (projectContainer) {
  const root = document.body.dataset.root || ".";
  const mode = projectContainer.dataset.projects;
  const filtersContainer = document.querySelector("[data-project-filters]");
  const paginationContainer = document.querySelector("[data-project-pagination]");
  const countContainer = document.querySelector("[data-project-count]");
  const pageSize = 6;
  let projects = [];
  let filterLabels = new Map();
  let activeFilter = "all";
  let currentPage = 1;

  // Les chemins des images sont écrits pour les pages internes dans le JSON.
  // Cette normalisation permet de réutiliser les mêmes données sur l'accueil.
  const resolveAsset = (path) => `${root}/${path.replace(/^\.\.\//, "")}`.replace("././", "./");

  const createProjectCard = (project) => {
    const article = document.createElement("article");
    article.className = "project-card";
    const technologyLabels = project.technologies.map((id) => filterLabels.get(id) || id);

    article.innerHTML = `
      <figure class="project-card__media">
        <img src="${resolveAsset(project.coverImage.url)}" alt="${project.coverImage.alt}" loading="lazy">
      </figure>
      <div class="project-card__body">
        <ul class="project-card__technologies" aria-label="Technologies utilisées">
          ${technologyLabels.slice(0, 3).map((label) => `<li>${label}</li>`).join("")}
        </ul>
        <h3>${project.title}</h3>
        <p>${project.resume}</p>
        <span class="project-card__link" aria-disabled="true" title="Étude de cas bientôt disponible">Étude de cas <span aria-hidden="true">→</span></span>
      </div>`;
    return article;
  };

  const renderPagination = (pageCount) => {
    if (!paginationContainer) return;
    paginationContainer.replaceChildren();
    if (pageCount <= 1) return;

    for (let page = 1; page <= pageCount; page += 1) {
      const button = document.createElement("button");
      button.type = "button";
      button.textContent = page;
      button.setAttribute("aria-label", `Afficher la page ${page} des projets`);
      if (page === currentPage) button.setAttribute("aria-current", "page");
      button.addEventListener("click", () => {
        currentPage = page;
        renderProjects();
        projectContainer.focus({ preventScroll: true });
        projectContainer.scrollIntoView({ behavior: "smooth", block: "start" });
      });
      paginationContainer.append(button);
    }
  };

  const renderProjects = () => {
    const filtered = activeFilter === "all"
      ? projects
      : projects.filter((project) => project.technologies.includes(activeFilter));
    const pageCount = Math.ceil(filtered.length / pageSize);
    const visibleProjects = mode === "featured"
      ? filtered.filter((project) => project.featured).slice(0, 3)
      : filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

    projectContainer.replaceChildren();
    if (!visibleProjects.length) {
      const message = document.createElement("p");
      message.className = "empty-message";
      message.textContent = "Aucun projet ne correspond à ce filtre.";
      projectContainer.append(message);
    } else {
      visibleProjects.forEach((project) => projectContainer.append(createProjectCard(project)));
    }

    if (countContainer && mode !== "featured") {
      countContainer.textContent = `${filtered.length} projet${filtered.length > 1 ? "s" : ""}`;
    }
    renderPagination(pageCount);
  };

  const renderFilters = (filters) => {
    if (!filtersContainer) return;
    filters.forEach((filter) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "filter-button";
      button.textContent = filter.label;
      button.setAttribute("aria-pressed", String(filter.id === activeFilter));
      button.addEventListener("click", () => {
        activeFilter = filter.id;
        currentPage = 1;
        filtersContainer.querySelectorAll("button").forEach((item) => {
          item.setAttribute("aria-pressed", String(item === button));
        });
        renderProjects();
      });
      filtersContainer.append(button);
    });
  };

  fetch(`${root}/data/projects.json`)
    .then((response) => {
      if (!response.ok) throw new Error(`Réponse HTTP ${response.status}`);
      return response.json();
    })
    .then((data) => {
      projects = data.projects;
      filterLabels = new Map(data.filters.map((filter) => [filter.id, filter.label]));
      renderFilters(data.filters);
      renderProjects();
    })
    .catch((error) => {
      console.error("Impossible de charger les projets :", error);
      projectContainer.innerHTML = '<p class="error-message">Les projets sont momentanément indisponibles. Merci de réessayer plus tard.</p>';
    });
}

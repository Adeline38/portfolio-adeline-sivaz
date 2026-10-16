const timelineContainer = document.querySelector("[data-timeline]");

if (timelineContainer) {
  const root = document.body.dataset.root || ".";
  const filtersContainer = document.querySelector("[data-experience-filters]");
  let experiences = [];
  let activeFilter = "all";

  const renderTimeline = () => {
    const filtered = activeFilter === "all"
      ? experiences
      : experiences.filter((item) => item.categoryId === activeFilter);
    timelineContainer.replaceChildren();
    filtered.forEach((item, index) => {
      const article = document.createElement("article");
      article.className = `timeline-card timeline-card--${item.categoryId}`;
      article.style.setProperty("--timeline-row", index + 1);
      article.innerHTML = `
        <p class="timeline-card__period">${item.period}</p>
        <p class="timeline-card__tag">${item.tag}</p>
        <h3>${item.title}</h3>
        <p class="timeline-card__organization">${item.organization}</p>
        <p class="timeline-card__description">${item.description}</p>`;
      timelineContainer.append(article);
    });
  };

  fetch(`${root}/data/experiences.json`)
    .then((response) => {
      if (!response.ok) throw new Error(`Réponse HTTP ${response.status}`);
      return response.json();
    })
    .then((data) => {
      experiences = data.experiences;
      filtersContainer.replaceChildren();
      data.filters.forEach((filter) => {
        const button = document.createElement("button");
        button.type = "button";
        button.className = "filter-button";
        button.textContent = filter.label;
        button.setAttribute("aria-pressed", String(filter.id === activeFilter));
        button.addEventListener("click", () => {
          activeFilter = filter.id;
          filtersContainer.querySelectorAll("button").forEach((item) => {
            item.setAttribute("aria-pressed", String(item === button));
          });
          renderTimeline();
        });
        filtersContainer.append(button);
      });
      renderTimeline();
    })
    .catch((error) => {
      console.error("Impossible de charger le parcours :", error);
      timelineContainer.innerHTML = '<p class="error-message">Le parcours est momentanément indisponible.</p>';
    });
}

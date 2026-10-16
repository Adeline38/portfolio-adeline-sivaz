const skillsContainer = document.querySelector("[data-skills]");

if (skillsContainer) {
  const root = document.body.dataset.root || ".";
  const illustrations = [
    "skills-programming.png",
    "skills-frameworks.png",
    "skills-design.png",
    "skills-versioning.png"
  ];
  const resolveAsset = (path) => `${root}/${path.replace(/^\.\.\//, "")}`.replace("././", "./");

  fetch(`${root}/data/skills.json`)
    .then((response) => {
      if (!response.ok) throw new Error(`Réponse HTTP ${response.status}`);
      return response.json();
    })
    .then((data) => {
      skillsContainer.replaceChildren();
      data.categories.forEach((category, index) => {
        const section = document.createElement("section");
        section.className = "skill-section";
        section.setAttribute("aria-labelledby", `skill-title-${category.id}`);
        section.innerHTML = `
          <div class="container">
            <div class="skill-section__header"><p class="eyebrow">${category.titleStart}</p><h2 id="skill-title-${category.id}">${category.title}</h2></div>
            <div class="skill-section__grid">
              <figure class="skill-section__visual"><img src="${root}/assets/images/illustrations/${illustrations[index] || illustrations[3]}" alt="" loading="lazy"></figure>
              <ul class="skill-items">
                ${category.skills.map((skill) => `<li class="skill-item"><span>${skill.name}</span><img src="${resolveAsset(skill.icon)}" alt="" loading="lazy"><progress class="skill-item__bar" max="100" value="${skill.level}" aria-label="Niveau de ${skill.name} : ${skill.level} %">${skill.level}%</progress></li>`).join("")}
              </ul>
            </div>
          </div>`;
        skillsContainer.append(section);
      });
    })
    .catch((error) => {
      console.error("Impossible de charger les compétences :", error);
      skillsContainer.innerHTML = '<p class="container error-message">Les compétences sont momentanément indisponibles.</p>';
    });
}

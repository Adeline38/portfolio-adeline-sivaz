const skillsPreview = document.querySelector("[data-skills-preview]");

if (skillsPreview) {
  fetch("data/skills.json")
    .then((response) => {
      if (!response.ok) throw new Error(`Réponse HTTP ${response.status}`);
      return response.json();
    })
    .then((data) => {
      skillsPreview.replaceChildren();
      data.categories.forEach((category, index) => {
        const item = document.createElement("li");
        item.innerHTML = `<span>${String(index + 1).padStart(2, "0")}</span><div><strong>${category.title}</strong><p>${category.skills.slice(0, 3).map((skill) => skill.name).join(" · ")}</p></div>`;
        skillsPreview.append(item);
      });
    })
    .catch((error) => {
      console.error("Impossible de charger l’aperçu des compétences :", error);
      skillsPreview.innerHTML = "<li>Les compétences sont momentanément indisponibles.</li>";
    });
}

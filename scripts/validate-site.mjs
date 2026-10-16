import { access, readFile, stat } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const errors = [];
const htmlFiles = [
  "index.html",
  "pages/404.html",
  "pages/competences.html",
  "pages/contact.html",
  "pages/mentions-legales.html",
  "pages/parcours.html",
  "pages/politique-confidentialite.html",
  "pages/projets.html",
];
const jsonFiles = [
  "data/experiences.json",
  "data/projects.json",
  "data/skills.json",
];

async function exists(filePath) {
  try {
    await access(filePath);
    return true;
  } catch {
    return false;
  }
}

for (const relativePath of jsonFiles) {
  try {
    JSON.parse(await readFile(path.join(root, relativePath), "utf8"));
  } catch (error) {
    errors.push(`${relativePath} : JSON invalide (${error.message})`);
  }
}

const ignoredReference = /^(?:#|https?:|mailto:|tel:|data:|javascript:)/i;
const referencePattern = /(?:href|src)\s*=\s*["']([^"']+)["']/gi;

for (const relativePath of htmlFiles) {
  const absolutePath = path.join(root, relativePath);
  const html = await readFile(absolutePath, "utf8");
  const activeHtml = html.replace(/<!--[\s\S]*?-->/g, "");
  const h1Count = (html.match(/<h1\b/gi) ?? []).length;

  if (h1Count !== 1) {
    errors.push(`${relativePath} : ${h1Count} balise(s) h1 au lieu d'une seule`);
  }

  for (const match of activeHtml.matchAll(referencePattern)) {
    const reference = match[1].split(/[?#]/, 1)[0];

    if (!reference || ignoredReference.test(reference)) {
      continue;
    }

    const target = reference.startsWith("/")
      ? path.join(root, reference.slice(1))
      : path.resolve(path.dirname(absolutePath), reference);

    if (!(await exists(target))) {
      errors.push(`${relativePath} : ressource introuvable « ${match[1]} »`);
    }
  }
}

function collectAssetReferences(value, references = []) {
  if (typeof value === "string" && value.startsWith("../assets/")) {
    references.push(value);
  } else if (Array.isArray(value)) {
    for (const item of value) collectAssetReferences(item, references);
  } else if (value && typeof value === "object") {
    for (const item of Object.values(value)) collectAssetReferences(item, references);
  }

  return references;
}

for (const relativePath of jsonFiles) {
  const data = JSON.parse(await readFile(path.join(root, relativePath), "utf8"));

  for (const reference of collectAssetReferences(data)) {
    const target = path.join(root, reference.replace(/^\.\.\//, ""));
    if (!(await exists(target))) {
      errors.push(`${relativePath} : ressource introuvable « ${reference} »`);
    }
  }
}

const compiledCss = path.join(root, "css", "main.css");
if (!(await exists(compiledCss)) || (await stat(compiledCss)).size === 0) {
  errors.push("css/main.css : feuille compilée absente ou vide");
}

if (errors.length > 0) {
  console.error("Validation du site échouée :");
  for (const error of errors) {
    console.error(`- ${error}`);
  }
  process.exitCode = 1;
} else {
  console.log("Validation réussie : JSON, pages HTML et ressources locales contrôlés.");
}

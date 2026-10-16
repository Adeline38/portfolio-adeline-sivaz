import { copyFile, cp, mkdir, readFile, rm } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const destination = path.join(root, "dist");

// L'artefact est reconstruit intégralement afin qu'aucun ancien fichier ne soit publié.
await rm(destination, { recursive: true, force: true });
await mkdir(destination, { recursive: true });

for (const directory of ["js", "pages"]) {
  await cp(path.join(root, directory), path.join(destination, directory), {
    recursive: true,
  });
}

await mkdir(path.join(destination, "css"), { recursive: true });
await copyFile(
  path.join(root, "css", "main.css"),
  path.join(destination, "css", "main.css"),
);

await mkdir(path.join(destination, "data"), { recursive: true });
for (const filename of ["experiences.json", "projects.json", "skills.json"]) {
  await copyFile(
    path.join(root, "data", filename),
    path.join(destination, "data", filename),
  );
}

for (const filename of ["index.html", "robots.txt", "sitemap.xml"]) {
  await copyFile(path.join(root, filename), path.join(destination, filename));
}

// Seules les ressources réellement référencées par le HTML, le CSS et les JSON
// sont intégrées à l'artefact. Les fichiers de travail restent dans le dépôt.
const assetReferences = new Set();
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

for (const relativePath of htmlFiles) {
  const html = (await readFile(path.join(root, relativePath), "utf8"))
    .replace(/<!--[\s\S]*?-->/g, "");

  for (const match of html.matchAll(/(?:href|src)\s*=\s*["']([^"']+)["']/gi)) {
    const reference = match[1].split(/[?#]/, 1)[0];
    if (!reference.includes("assets/")) continue;

    const absoluteAsset = path.resolve(path.dirname(path.join(root, relativePath)), reference);
    assetReferences.add(path.relative(root, absoluteAsset));
  }
}

function collectJsonAssets(value) {
  if (typeof value === "string" && value.startsWith("../assets/")) {
    assetReferences.add(value.replace(/^\.\.\//, ""));
  } else if (Array.isArray(value)) {
    for (const item of value) collectJsonAssets(item);
  } else if (value && typeof value === "object") {
    for (const item of Object.values(value)) collectJsonAssets(item);
  }
}

for (const filename of ["experiences.json", "projects.json", "skills.json"]) {
  collectJsonAssets(
    JSON.parse(await readFile(path.join(root, "data", filename), "utf8")),
  );
}

const css = await readFile(path.join(root, "css", "main.css"), "utf8");
for (const match of css.matchAll(/url\(["']?([^"')]+)["']?\)/gi)) {
  if (!match[1].includes("assets/")) continue;
  const absoluteAsset = path.resolve(path.join(root, "css"), match[1]);
  assetReferences.add(path.relative(root, absoluteAsset));
}

for (const filename of [
  "skills-programming.png",
  "skills-frameworks.png",
  "skills-design.png",
  "skills-versioning.png",
]) {
  assetReferences.add(path.join("assets", "images", "illustrations", filename));
}

for (const relativePath of assetReferences) {
  const target = path.join(destination, relativePath);
  await mkdir(path.dirname(target), { recursive: true });
  await copyFile(path.join(root, relativePath), target);
}

console.log(`Artefact de production créé dans dist/ (${assetReferences.size} ressources).`);

# Portfolio - Adeline Sivaz

Portfolio professionnel d’Adeline Sivaz, développeuse web full stack.

Le domaine de production prévu est [adelinesivaz.com](https://adelinesivaz.com).

## Aperçu

Le portfolio présente :

- le parcours professionnel et les formations ;
- les compétences techniques, notamment conception graphique et développement web ;
- une sélection de projets ;
- un formulaire de contact géré par Formspree ;
- les pages de mentions légales et de politique de confidentialité.

## Technologies utilisées

- HTML5 sémantique ;
- SCSS compilé en CSS ;
- JavaScript natif ;
- fichiers JSON pour les contenus dynamiques ;
- Formspree pour l’envoi du formulaire de contact ;
- hébergement Web OVHcloud.

Le projet ne dépend d’aucun framework JavaScript ou CSS.

## Lancer le projet localement

1. Cloner ou télécharger ce dépôt.
2. Installer Sass avec `npm install`.
3. Compiler les styles avec `npm run build`.
4. Lancer le dossier avec un serveur local, par exemple l’extension Live Server de Visual Studio Code.

L’utilisation d’un serveur local est recommandée, car les compétences, expériences et projets sont chargés depuis des fichiers JSON avec JavaScript.

## Organisation du projet

```text
assets/             Images, polices et document PDF public
css/                Feuille CSS compilée utilisée par les pages
data/               Sources des contenus dynamiques au format JSON
js/                 Comportements JavaScript du site
pages/              Pages secondaires du portfolio
scss/               Sources SCSS à compiler vers css/main.css
index.html          Page d’accueil
robots.txt          Consignes destinées aux moteurs de recherche
sitemap.xml         Liste des pages à explorer par les moteurs de recherche
```

## Gérer les contenus

Les fichiers JSON sont les sources uniques des contenus correspondants :

- `data/projects.json` : cartes de projets ;
- `data/skills.json` : catégories et compétences techniques ;
- `data/experiences.json` : frise du parcours professionnel et des formations.

Pour ajouter un projet, modifier `data/projects.json`. Les trois projets ayant la propriété `"featured": true` sont affichés dans la section Projets de la page d’accueil.

## Contact

Le formulaire de contact envoie les messages vers Formspree avec un formulaire HTML classique. Aucun serveur PHP ni base de données n’est utilisé par le projet.

## Intégration et déploiement continus

La branche `develop` reçoit le développement courant. Une Pull Request validée permet ensuite de promouvoir une version stable vers `main`.

Le workflow d’intégration continue exécute `npm ci` puis `npm run ci`. Cette commande :

- compile le SCSS de production ;
- valide les JSON, les pages HTML et leurs ressources locales ;
- construit un artefact `dist/` ne contenant que les fichiers publics nécessaires.

Une fusion dans `main` déclenche le workflow de production. Celui-ci reconstruit l’artefact, sauvegarde la version présente sur OVHcloud, puis synchronise le site vers le dossier racine `adelinesivaz` avec SSH et `rsync`.

Le dépôt GitHub doit contenir un environnement `production` et les secrets suivants :

- `OVH_SSH_HOST` : serveur SSH OVHcloud ;
- `OVH_SSH_USER` : utilisateur SSH ;
- `OVH_SSH_PRIVATE_KEY` : clé privée réservée au déploiement ;
- `OVH_KNOWN_HOSTS` : empreinte SSH vérifiée du serveur.

La variable facultative `OVH_SSH_PORT` permet de remplacer le port SSH par défaut `22`.

Les fichiers de configuration locale, les secrets, les dépendances, le CSS compilé et l’artefact `dist/` sont exclus du dépôt.

## Qualité

Avant chaque publication, contrôler le responsive, la navigation au clavier, les contrastes, les liens et le chargement des contenus JSON. Les résultats d’audit ne sont documentés qu’après une mesure réelle sur la version publiée.

## Auteur

Adeline Sivaz
[LinkedIn](https://www.linkedin.com/in/adeline-s-72969180/) · [GitHub](https://github.com/Adeline38) · [Portfolio](https://adelinesivaz.com)

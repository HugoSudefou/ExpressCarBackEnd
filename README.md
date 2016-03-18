CARea
Application de service entre voisins

Installation

$ npm install

Lancer l'application

$ node bin/www

Documentation

Openclassroom

Structure

Le développement se fera exclusiement dans le dossier ./src. Le fichier ./config.js contient les routes de l'application, il sera modifié à chaque nouvelle page. Tout le style se trouve dans assets/css. Un fichier.scss par page à importer dans le main.scss.

Les modules js sont avec le html dans le dossier views

Git

Lors du développement d'une nouvelle fonctionnalité, mettre son projet à jour puis créer sa branche

$ git pull
$ git checkout -b my_branch
Une fois le développement terminé

$ git status
$ git add chemin/vers/fichier.xxx
$ git commit -m "Ce que j'ai fais"
$ git push origin my_branch
Vous verrez vorte branche apparaître sur github et pourrez créer une pull request pour la merge avec develop. Pour plus de détail : Les branches

Description

npm (package manager)

Toutes les bibliothèques externes sont gérées avec npm, listées dans package.json et présentes dans le dossier ./node_modules.(A ne jamais commit !)

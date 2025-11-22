# Gestion du Personnel — Plan du Bâtiment

## Description
Application front-end pour ajouter, assigner et retirer des employés sur un plan d'étage (image). Implementée avec HTML + Tailwind CSS (CDN) + JavaScript vanilla.

## Installation
1. Placer tous les fichiers du projet dans un dossier.
2. Mettre `prov.jpg` (plan) à la racine (même dossier que `index.html`).
3. Ouvrir `index.html` dans un navigateur (aucun serveur requis).


## Structure du Projet
project/
├── index.html          
├── assets/
│   └── style.css       
│   ├── modal.js        
│   ├── staff.js        
│   ├── storage.js      
│   └── zones.js        
└── README.md          


## Fichiers
- `index.html` — interface principale (utilise `prov.jpg`).
- `style.css` — styles additionnels (positions des overlays).
- `js/modal.js` — modale & expériences.
- `js/zones.js` — règles métier et assign modal.
- `js/staff.js` — CRUD employé, assignation, profils.
- `js/storage.js` — gestion du localstorage.
- `prov.jpg` — image du plan .


## Notes
- UI design fait en index.html en utilisant les classes utilitaires de Tailwind.css
- Les overlays sont positionnées en CSS (`style.css`) en mode (boîtes semi-transparentes). 
- Pop up partie est traitée dans `js/modal.js`.
- Règles métier implémentées (Réception, Serveurs, Sécurité, Archives, Manager, Nettoyage).
- Capacités configurables dans `js/zones.js`.
- Gestion du localstorage dans `js/storage.js`.

## Déploiement
- Publier sur GitHub Pages .


## Auteur
- Ce projet a été fait avec passion par: Mr OIRGARI ABDERRAHMAN


# Formation CDA 2025

Ce dépôt illustre un petit service Node.js utilisant **Express** et **Mongoose**. Il expose un service de gestion d'utilisateurs ainsi qu'une suite de tests unitaires.

## Installation

```bash
npm install
```

Une base MongoDB doit être accessible. L'URL de connexion est définie dans `config.js`.

## Lancement du serveur

```bash
node server.js
```

## Lancement des tests

```bash
npm test
```

## Structure du projet

- `server.js` : point d'entrée de l'application Express.
- `config.js` : configuration (URL Mongo).
- `schemas/` : schémas Mongoose (ex. `User.js`).
- `services/` : logique métier (CRUD sur les utilisateurs).
- `utils/` : outils divers comme la gestion d'erreurs.
- `test/` : suite de tests Mocha.

Chaque fichier source a été abondamment commenté pour faciliter la compréhension du code et des différentes étapes.

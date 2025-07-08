const express = require('express') // Importe le framework Express
const app = express() // Initialise l'application Express
const port = 3000 // Port d'écoute du serveur

// getting-started.js
const mongoose = require('mongoose') // Importe Mongoose pour communiquer avec MongoDB

main().catch(err => console.log(err)) // Lance la connexion à Mongo et log l'erreur si besoin

async function main () {
  await mongoose.connect('mongodb://127.0.0.1:27017/test') // Connexion à la base locale

  // Utiliser `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` si votre base nécessite une authentification
}

app.get('/', (req, res) => { // Route GET basique
  res.send('Hello World!') // Réponse simple en texte
})

app.listen(port, () => { // Démarrage du serveur HTTP
  console.log(`Example app listening on port ${port}`) // Affiche un message au démarrage
})
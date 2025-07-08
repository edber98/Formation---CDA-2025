const mongoose = require('mongoose') // Importe mongoose

// Schéma de l'utilisateur
const UserSchema = new mongoose.Schema({
  // Nom d'utilisateur unique et obligatoire
  username: {
    type: String,
    index: true,
    unique: true,
    required: true
  },
  // Adresse mail de l'utilisateur
  email: {
    type: String,
    required: true
  },
  // Mot de passe en clair (pour exemple uniquement)
  password: {
    type: String,
    required: true
  },
  // Code de statut de l'utilisateur (actif/inactif etc.)
  status_code: {
    type: Number,
    required: true,
    default: 1
  },
  // Date de création du compte
  createdAt: {
    type: Date,
    required: true,
    default: new Date()
  },
})

module.exports = UserSchema // Exporte le schéma pour création du modèle

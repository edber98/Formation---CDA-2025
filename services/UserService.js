const mongoose = require('mongoose') // Importe mongoose
const UserSchema = require('../schemas/User') // Schéma utilisateur

const User = mongoose.model('User', UserSchema) // Création du modèle User

const ErrorManager = require('../utils/error') // Gestionnaire d'erreurs personnalisé

/*
    Fonctions CRUD utilisées dans les tests
    - Créer un élément
    - Modifier un élément
    - Récupérer un élément
    - Supprimer un élément
*/

/**
 * Ajoute un utilisateur en base
 * @param {Object} payload Données du nouvel utilisateur
 * @param {Object|null} options Options diverses
 */
module.exports.addOneUser = async function (payload, options = null) {
    try {
        var newUser = new User(payload) // Création d'une instance du modèle
        let save = await newUser.save() // Sauvegarde en base
        return save
    }
    catch (err) {
        throw (ErrorManager.parsingError(err)) // Normalisation de l'erreur
    }
}

/**
 * Recherche un utilisateur par identifiant
 */
module.exports.findOneUserById = async function (id, options = null) {
    try {
        let val = await User.findById(id) // Cherche l'utilisateur
        if (options && options.error_not_found && !val) {
            // Erreur personnalisée si demandé
            throw { type: 'NOT_FOUND', message: 'Element non trouvé.' }
        }
        return val
    }
    catch (err) {
        throw (ErrorManager.parsingError(err))
    }
}

/**
 * Met à jour un utilisateur via son identifiant
 */
module.exports.updateOneUserById = async function (id, update, options = null) {
    try {
        let val = await User.findByIdAndUpdate(id, update, { returnDocument: 'after', runValidators: true }) // Mise à jour
        if (options && options.error_not_found && !val) {
            // Lance une erreur si demandé et que l'utilisateur n'existe pas
            throw { type: 'NOT_FOUND', message: 'Element non trouvé.' }
        }
        return val
    }
    catch (err) {
        throw (ErrorManager.parsingError(err))
    }
}


/**
 * Supprime un utilisateur
 */
module.exports.deleteOneUserById = async function (id, options = null) {
    try {
        let val = await User.findByIdAndDelete(id) // Suppression directe
        if (options && options.error_not_found && !val) {
            throw { type: 'NOT_FOUND', message: 'Element non trouvé.' }
        }
        return val
    }
    catch (err) {
        throw (ErrorManager.parsingError(err))
    }
}

const mongoose = require('mongoose') // Importe mongoose pour identifier les erreurs

// Formate les erreurs de validation de champs mongoose
let createValidationFieldsError = function (error, options) {
    let keys_error = Object.keys(error.errors) // Récupère les noms des champs en erreur
    let error_formated = error.errors // Accès direct aux informations d'erreur
    let object_error = {} // Objet contenant le détail des erreurs
    keys_error.forEach((element) => {
        object_error[element] = error_formated[element].message // Copie le message associé à chaque champ
    })
    return object_error
}


// Normalise les différents types d'erreurs mongoose en un format commun
let pasingMongooseError = function (error, options) {
    if (error instanceof mongoose.Error.ValidationError) {
        // Erreur de validation : on renvoie le détail des champs invalides
        var field_errors = createValidationFieldsError(error, options)
        return { type: 'NOT_VALID', message: 'Le schéma est incorrect.', fields: field_errors }
        /*  {fields: { <champs en erreur>: 'Le champs est requis' }}  */
    }
    else if (error && error.code == 11000) {
        // Doublon d'un champ unique
        return { type: 'DUPLICATE', message: "Un champs n'est pas unique.", fields: error.keyValue }
    }
    else if (error instanceof mongoose.Error.CastError) {
        // Problème de conversion d'un champ (ex: ObjectId invalide)
        return { type: 'NOT_VALID_CAST', message: 'Un champ ne dispose pas du bon format.', fields: {[error.path]: error.reason.message} }
    }
    console.log("Cas d'erreur mongoose non gerer non gérer")
    return error
}


// Point d'entrée pour parser toutes les erreurs métiers
module.exports.parsingError = function (error, options) {
    if ((error instanceof mongoose.Error) || (error && error.code == 11000)) {
        // Si l'erreur vient de mongoose, on la normalise
        return pasingMongooseError(error, options)
    }
    console.log("Cas d'erreur non gérer")
    return error
}
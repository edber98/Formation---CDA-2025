const mongoose = require('mongoose')
const UserSchema = require('../schemas/User')

const User = mongoose.model('User', UserSchema);



const ErrorManager = require('../utils/error')

/* 
    - Créer un element
    - Modifier un element
    - Recuperer un element
    - Supprimer un element
*/

module.exports.addOneUser = async function (payload, options = null) {
    try {
        var newUser = new User(payload)
        let save = await newUser.save()
        return save
    }
    catch (err) {
        throw (ErrorManager.parsingError(err))
    }
}

module.exports.findOneUserById = async function (id, options = null) {
    try {
        let val = await User.findById(id)
        if (options && options.error_not_found && !val) {
            throw { type: 'NOT_FOUND', message: 'Element non trouvé.' }
        }
        return val
    }
    catch (err) {
        throw (ErrorManager.parsingError(err))
    }
}

module.exports.updateOneUserById = async function (id, update, options = null) {
    try {
        let val = await User.findByIdAndUpdate(id, update, {returnDocument: 'after', runValidators: true})
        if (options && options.error_not_found && !val) {
            throw { type: 'NOT_FOUND', message: 'Element non trouvé.' }
        }
        return val
    }
    catch (err) {
        throw (ErrorManager.parsingError(err))
    }
}


module.exports.deleteOneUserById = async function (id, options = null) {
    try {
        let val = await User.findByIdAndDelete(id)
        if (options && options.error_not_found && !val) {
            throw { type: 'NOT_FOUND', message: 'Element non trouvé.' }
        }
        return val
    }
    catch (err) {
        throw (ErrorManager.parsingError(err))
    }
}

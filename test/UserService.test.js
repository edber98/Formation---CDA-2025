const assert = require('assert');
const mongoose = require('mongoose');
const UserService = require('../services/UserService')
const config = require('../config')
const should = require('should');


let userValidSchema = {
  username: 'Edouard',
  email: "edouard.jean@luc.com",
  password: "bob"
}

let userNotValidSchemaNoUsername = {
  usernames: 'Edouard',
  email: "edouard.jean@luc.com",
  password: "bob"
}

let userNotValidSchemaCastNumberError = {
  username: 'EdouardBernier',
  email: "edouard.jean@luc.com",
  password: "bob",
  status_code: "Je suis la"
}


before((done) => {
  (async () => {

    const connection = await mongoose.connect(config.mongo_url);
    await connection.connection.db.dropDatabase();
    const modelPromises = Object.values(mongoose.models).map(model => model.syncIndexes());
    await Promise.all(modelPromises);
    //await connection.connection.db.syncIndexes(); 
  })().then(() => {
    done();
  }).catch((e) => {
    console.log(e)
  });
});


describe('UserService - addOneUser', function () {
  it('Ajouter un user avec succes.', async function () {
    let resultat = await UserService.addOneUser(userValidSchema)
    should(resultat).have.property('username', userValidSchema.username);
    should(resultat).have.property('email', userValidSchema.email);
    should(resultat).have.property('password', userValidSchema.password);
    should(resultat).have.property('_id');
    should(resultat).have.property('createdAt');
    userValidSchema['_id'] = resultat._id
  });
  it('Ajouter un user sans username.', async function () {
    let resultat = await UserService.addOneUser(userNotValidSchemaNoUsername).should.be.rejectedWith(Object)
    should(resultat).have.property('type', 'NOT_VALID');
    should(resultat).have.property('fields');
    should(resultat.fields).have.property('username', 'Path `username` is required.');
  });
  it('Ajouter un user avec le meme username.', async function () {
    let tmp_user_no_valid = { ...userValidSchema }
    delete tmp_user_no_valid['_id']
    let resultat = await UserService.addOneUser(tmp_user_no_valid).should.be.rejectedWith(Object)
    should(resultat).have.property('type', 'DUPLICATE');
    should(resultat).have.property('fields');
    should(resultat.fields).have.property('username', tmp_user_no_valid.username);
  });
  it('Ajouter un user avec une erreur de type sur status code.', async function () {
    let resultat = await UserService.addOneUser(userNotValidSchemaCastNumberError).should.be.rejectedWith(Object)

    should(resultat).have.property('type', 'NOT_VALID');
    should(resultat).have.property('fields');
    should(resultat.fields).have.property('status_code');
  });

});

describe('UserService - findOneUserById', function () {
  it('Chercher un user avec succes.', async function () {
    let resultat = await UserService.findOneUserById(userValidSchema['_id'])
    should(resultat).have.property('username', userValidSchema.username);
    should(resultat).have.property('email', userValidSchema.email);
    should(resultat).have.property('password', userValidSchema.password);
    should(resultat).have.property('_id');
    should(resultat).have.property('createdAt');
  });
  it('Chercher un user avec un Id pas en format ObjectId.', async function () {
    let resultat = await UserService.findOneUserById("Salut ca va").should.be.rejectedWith(Object)
    should(resultat).have.property('type', 'NOT_VALID_CAST');
    should(resultat).have.property('message', "Un champ ne dispose pas du bon format.");
    should(resultat).have.property('fields');
    should(resultat.fields).have.property('_id');
  });
  it("Chercher un user avec un Id non existant sans declancher d'erreur.", async function () {
    let resultat = await UserService.findOneUserById(new mongoose.Types.ObjectId())/* .should.be.rejectedWith(Object) */
    should(resultat).not.be.ok();
  });
  it("Chercher un user avec un Id non existant en declanchant une erreur not found.", async function () {
    let resultat = await UserService.findOneUserById(new mongoose.Types.ObjectId(), { error_not_found: true }).should.be.rejectedWith(Object)
    should(resultat).have.property('type', 'NOT_FOUND');
    should(resultat).have.property('message', "Element non trouvé.");
  });
  it("Chercher un user avec un Id null et declencher not found.", async function () {
    let resultat = await UserService.findOneUserById(null, { error_not_found: true }).should.be.rejectedWith(Object)
    should(resultat).have.property('type', 'NOT_FOUND');
    should(resultat).have.property('message', "Element non trouvé.");
  });
  it("Chercher un user avec un Id null et sans declencher not found.", async function () {
    let resultat = await UserService.findOneUserById(null, { error_not_found: false })
    should(resultat).not.be.ok();
  });
});

describe('UserService - updateOneUserById', function () {
  it('Modifier un user avec succes.', async function () {
    let email = "jean.luc@gmail.com"
    let resultat = await UserService.updateOneUserById(userValidSchema['_id'], { email: email })
    //console.log(resultat)
    should(resultat).have.property('username', userValidSchema.username);
    should(resultat).have.property('email', email);
    should(resultat).have.property('password', userValidSchema.password);
    should(resultat).have.property('_id');
    should(resultat).have.property('createdAt');
  });

  it('Modifier un user avec un username vide.', async function () {
    let resultat = await UserService.updateOneUserById(userValidSchema['_id'], { username: '' }).should.be.rejectedWith(Object)
    should(resultat).have.property('type', 'NOT_VALID');
    should(resultat).have.property('fields');
    should(resultat.fields).have.property('username', 'Path `username` is required.');
  });
  it("Modifier un user avec un Id null et sans declencher not found.", async function () {
    let resultat = await UserService.updateOneUserById(null, {}, { error_not_found: false })
    should(resultat).not.be.ok();
  });
  it("Modifier un user avec un Id null et declencher not found.", async function () {
    let resultat = await UserService.updateOneUserById(null, {}, { error_not_found: true }).should.be.rejectedWith(Object)
    should(resultat).have.property('type', 'NOT_FOUND');
    should(resultat).have.property('message', "Element non trouvé.");
  });
})


describe('UserService - deleteOneUserById', function () {
  it('Supprimer un user avec succes.', async function () {
    let resultat = await UserService.deleteOneUserById(userValidSchema['_id'])
    should(resultat).have.property('username', userValidSchema.username);
    should(resultat).have.property('email');
    should(resultat).have.property('password', userValidSchema.password);
    should(resultat).have.property('_id');
    should(resultat).have.property('createdAt');
  });
   it('Supprimer un user avec un Id pas en format ObjectId.', async function () {
    let resultat = await UserService.deleteOneUserById("Salut ca va").should.be.rejectedWith(Object)
    should(resultat).have.property('type', 'NOT_VALID_CAST');
    should(resultat).have.property('message', "Un champ ne dispose pas du bon format.");
    should(resultat).have.property('fields');
    should(resultat.fields).have.property('_id');
  });
  it("Supprimer un user avec un Id non existant sans declancher d'erreur.", async function () {
    let resultat = await UserService.deleteOneUserById(new mongoose.Types.ObjectId())
    should(resultat).not.be.ok();
  });
  it("Supprimer un user avec un Id non existant en declanchant une erreur not found.", async function () {
    let resultat = await UserService.deleteOneUserById(new mongoose.Types.ObjectId(), { error_not_found: true }).should.be.rejectedWith(Object)
    should(resultat).have.property('type', 'NOT_FOUND');
    should(resultat).have.property('message', "Element non trouvé.");
  });
  it("Supprimer un user avec un Id null et declencher not found.", async function () {
    let resultat = await UserService.deleteOneUserById(null, { error_not_found: true }).should.be.rejectedWith(Object)
    should(resultat).have.property('type', 'NOT_FOUND');
    should(resultat).have.property('message', "Element non trouvé.");
  });
  it("Supprimer un user avec un Id null et sans declencher not found.", async function () {
    let resultat = await UserService.deleteOneUserById(null, { error_not_found: false })
    should(resultat).not.be.ok();
  }); 
});
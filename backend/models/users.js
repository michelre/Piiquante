/***Création modèle utilisateur***/

const mongoose = require('mongoose');
//Empecher d'avoir deux utilisateurs avec le meme email
const uniqueValidator = require('mongoose-unique-validator'); 

const userSchema = mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }
});

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userSchema);
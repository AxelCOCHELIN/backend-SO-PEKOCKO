const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const userSchema = mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    validate: /[A-Za-z0-9@.]/,
  }, //adresse électronique de l'utilisateur [unique]
  password: { type: String, required: true, validate: /[A-Za-z0-9@.]/ }, //hachage du mot de passe de l'utilisateur
});

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model("User", userSchema);

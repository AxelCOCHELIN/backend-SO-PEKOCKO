const bcrypt = require("bcrypt");
const jsonWebToken = require("jsonwebtoken");
const User = require("../models/user");
const emailValidator = require("email-validator");
const passwordValidator = require("password-validator");

// Create a schema
var validPassword = new passwordValidator();

validPassword
  .is()
  .min(8) // longueur mini 8
  .is()
  .max(20) // longueur maxi 20
  .has()
  .uppercase() // doit contenir une majuscule
  .has()
  .lowercase() // doit contenir une minuscule
  .has()
  .digits() // doit contenir un chiffre
  .has()
  .not()
  .spaces(); // ne doit pas contenir d'espace

exports.signup = (req, res, next) => {
  if (
    !emailValidator.validate(req.body.email) ||
    !validPassword.validate(req.body.password)
  ) {
    throw { error: " entrée invalide !" };
  } else if (
    emailValidator.validate(req.body.email) &&
    validPassword.validate(req.body.password)
  ) {
    //appeler la fonction de hachage, créer un nouvel utilisateur, le sauvegarder dans la base de données
    bcrypt
      .hash(req.body.password, 10)
      .then((hash) => {
        const user = new User({
          email: req.body.email,
          password: hash,
        });
        user
          .save()
          .then(res.status(201).json({ message: "Nouvel utilisateur créé !" }))
          .catch((error) => res.status(400).json({ error }));
      })
      .catch((error) => res.status(500).json({ error }));
  }
};

exports.login = (req, res, next) => {
  /**trouver l'utilisateur qui correspond à l'adresse mail unique
   * si non trouvé renvoyer une erreur
   * si trouvé comparer le mot de passe haché avec celui de la base de données grâce à bcrypt
   * si mot de passe non valide renvoyer une erreur
   * si valide, valider la requête, renvoyer un userId et un token
   * si erreur autre renvoyer une erreur serveur
   */

  User.findOne({ email: req.body.email })
    .then((user) => {
      if (!user) {
        return res.status(401).json({ message: "Utilisateur non trouvé !" });
      } else {
        bcrypt
          .compare(req.body.password, user.password)
          .then((valid) => {
            if (!valid) {
              return res
                .status(401)
                .json({ message: "Mot de passe incorrect !" });
            }
            res.status(200).json({
              userId: user._id,
              token: jsonWebToken.sign(
                { userId: user._id },
                "biit,?^OeTv@Dfr68LI%L.l$?U7{2qfZ75.LXO_Udz.D'$@0(p2rfAg4{FZG",
                { expiresIn: "24h" }
              ),
            });
          })
          .catch((error) => res.status(500).json({ error }));
      }
    })
    .catch((error) => res.status(500).json({ error }));
};

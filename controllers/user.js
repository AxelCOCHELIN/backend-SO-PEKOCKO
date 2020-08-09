const bcrypt = require("bcrypt"); //importe bcrypt
const jsonWebToken = require("jsonwebtoken"); //importe jsonwebtoken
const User = require("../models/user"); //importe le modèle User
const emailValidator = require("email-validator"); //importe le validateur d'email
const passwordValidator = require("password-validator"); //importe le validateur de mot de passe

let validPassword = new passwordValidator(); //crée une variable pour paramétrer le validateur de mot de passe

validPassword
  .is()
  .min(8) // Longueur mini de 8 caractères
  .is()
  .max(20) // Longueur maxi de 20 caractères
  .has()
  .uppercase() // Doit contenir une majuscule
  .has()
  .lowercase() // Doit contenir une minuscule
  .has()
  .digits() // Doit contenir un chiffre
  .has()
  .not()
  .spaces(); // Ne peut pas contenir d'espaces

exports.signup = (req, res, next) => {
  if (
    !emailValidator.validate(req.body.eamil) ||
    !validPassword.validate(req.body.password) //si l'adresse mail ou le mot de passe ne sont pas valide
  ) {
    throw {
      error:
        "Merci de bien vouloir entrer une adresse email et un mot de passe valide !", //on renvoit une erreur
    };
  } else if (
    emailValidator.validate(req.body.email) &&
    validPassword.validate(req.body.password) //si l'adresse mail et le mot de passe sont valide
  ) {
    bcrypt
      .hash(req.body.password, 10) //on appelle la fonction de hachage
      .then((hash) => {
        const user = new User({
          email: req.body.email,
          password: hash,
        }); //on crée un nouvel utilisateur
        user
          .save() //on sauvegarde le nouvel utilisateur dans la base de données
          .then(res.status(201).json({ message: "Nouvel utilisateur créé !" })) // on renvoie une réponse positive
          .catch((error) => res.status(400).json({ error })); // si problème: on renvoie une erreur
      })
      .catch((error) => res.status(500).json({ error })); // si problème serveur : on renvoie une erreur
  }
};

exports.login = (req, res, next) => {
  User.findOne({ email: req.body.email }) //trouver l'utilisateur qui correspond à l'adresse mail unique
    .then((user) => {
      if (!user) {
        return res.status(401).json({ message: "Utilisateur non trouvé !" }); //si non trouvé renvoyer une erreur
      }
      bcrypt
        .compare(req.body.password, user.password) //si trouvé comparer le mot de passe haché avec celui de la base de données grâce à bcrypt
        .then((valid) => {
          if (!valid) {
            return res
              .status(401)
              .json({ message: "Mot de passe incorrect !" }); //si mot de passe non valide renvoyer une erreur
          }
          res.status(200).json({
            userId: user._id,
            token: jsonWebToken.sign(
              { userId: user._id },
              "biit,?^OeTv@Dfr68LI%L.l$?U7{2qfZ75.LXO_Udz.D'$@0(p2rfAg4{FZG",
              { expiresIn: "24h" }
            ), //si valide, valider la requête, renvoyer un userId et un token
          });
        })
        .catch((error) => res.status(500).json({ error })); //si erreur autre renvoyer une erreur serveur
    })
    .catch((error) => res.status(500).json({ error })); //si erreur autre renvoyer une erreur serveur
};

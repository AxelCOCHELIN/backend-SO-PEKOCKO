const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const path = require("path");
require("dotenv").config();
//importe des modules express, nodyparser, mongoose et path

const userRoutes = require("./routes/user"); //lie les routes user à l'app
const sauceRoutes = require("./routes/sauces");

const app = express(); //créer l'application express

/**connecte la base de données mongoDB à l'app */
mongoose
  .connect(process.env.MONGODBaccess, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connexion à MongoDB réussie !"))
  .catch(() => console.log("Connexion à MongoDB échouée !"));

//gestion CORS
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*"); //accéder à l'API depuis n'importe quelle origine ( '*' ) ;
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
  ); //ajouter les headers mentionnés aux requêtes envoyées vers l'API (Origin , X-Requested-With , etc.) ;
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  ); //envoyer des requêtes avec les méthodes mentionnées ( GET ,POST , etc.).
  next();
}); //initialisation des headers pour empécher le CORS de bloquer l'application

app.use(bodyParser.json()); //défini la fonction json comme middleware global

app.use("/images", express.static(path.join(__dirname, "images"))); //permet d'accéder au dossier images

app.use("/api/auth", userRoutes); //l'application utilise le endpoint /api/auth pour les routes userRoutes
app.use("/api/sauces", sauceRoutes); //l'application utilise le endpoint /api/sauces pour les routes sauceRoutes

module.exports = app;

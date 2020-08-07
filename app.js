const express = require("express");

const app = express();

app.use((req, res) => {
  res.json({ message: "La réponse du serveur a bien été envoyé !" });
});

module.exports = app;

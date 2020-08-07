const express = require("express");

const app = express();

app.use((req, res) => {
  res.json({ message: "La réponse du serveur est toujours bien envoyé !" });
});

module.exports = app;

const jwt = require("jsonwebtoken");
const bodyParser = require("body-parser");

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = jwt.verify(
      token,
      "biit,?^OeTv@Dfr68LI%L.l$?U7{2qfZ75.LXO_Udz.D'$@0(p2rfAg4{FZG"
    );
    const userId = decodedToken.userId;
    if (req.body.userId && req.body.userId !== userId) {
      throw "User Id non valable !";
    } else {
      next();
    }
  } catch (error) {
    res.status(401).json({ error: error | "Requête non authentifiée !" });
  }
};

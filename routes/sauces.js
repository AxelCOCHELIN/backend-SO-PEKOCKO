const express = require("express");
const router = express.Router();
const sauceControllers = require("../controllers/sauces");
const auth = require("../middleware/auth");
const multer = require("../middleware/multer-config");

router.get("/sauces", auth, sauceControllers.getAllSauces);
router.get("/sauces", auth, sauceControllers.getOneSauce);
router.post("/sauces", auth, multer, sauceControllers.createSauce);

module.exports = router;

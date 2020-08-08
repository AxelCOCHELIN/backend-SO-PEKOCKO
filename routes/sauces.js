const express = require("express");
const router = express.Router();
const sauceControllers = require("../controllers/sauces");
const auth = require("../middleware/auth");
const multer = require("../middleware/multer-config");

router.get("/", auth, sauceControllers.getAllSauces);
router.get("/", auth, sauceControllers.getOneSauce);
router.post("/", auth, multer, sauceControllers.createSauce);

module.exports = router;

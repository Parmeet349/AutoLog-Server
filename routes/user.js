const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const { userInfo } = require("../controllers/userController");

router.use(auth);
console.log("User routes loaded");
router.get("/", userInfo);

module.exports = router;

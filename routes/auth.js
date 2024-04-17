const express = require("express");
const router = express.Router();
const { login, register } = require("../controllers/auth");
const { authMiddleware } = require("../middleware/authentication");

router.post("/login", authMiddleware, login);
router.post("/register", register);

module.exports = router;

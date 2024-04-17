const express = require("express");
const router = express.Router();
const { populateDB, createMovie } = require("../controllers/movies");

router.post("/populate", populateDB);
router.post("/addMovie", createMovie);

module.exports = router;

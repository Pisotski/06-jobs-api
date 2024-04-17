const express = require("express");
const router = express.Router();
const {
	populateDB,
	createMovie,
	getAllMovies,
} = require("../controllers/movies");

router.post("/populate", populateDB);
router.post("/addMovie", createMovie);
router.get("/getAllMovies", getAllMovies);

module.exports = router;

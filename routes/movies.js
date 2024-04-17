const express = require("express");
const router = express.Router();
const {
	populateDB,
	createMovie,
	getAllMovies,
	findMovie,
	updateMovie,
	removeMovie,
} = require("../controllers/movies");

router.post("/populate", populateDB);
router.post("/addMovie", createMovie);
router.get("/", getAllMovies);
router.get("/myMovies/:id", findMovie);
router.patch("/myMovies/:id", updateMovie);
router.delete("/myMovies/:id", removeMovie);

module.exports = router;

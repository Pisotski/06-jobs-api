const Movie = require("../models/Movie");
const { StatusCodes } = require("http-status-codes");
const { BadRequestError, NotFoundError } = require("../errors");
const data = require("../mockData");
const { removeNullsAndUndefined, makeDate } = require("../helpers");

const getAllMovies = (req, res) => {
	res.send("hello");
};

const createMovie = async (req, res) => {
	const { user, body } = req;
	removeNullsAndUndefined(body);
	const movies = await Movie.create({
		createdBy: user.userId,
		...body,
	});

	res.status(StatusCodes.CREATED).json({ movies });
};

const populateDB = async (req, res) => {
	try {
		const moviesCollection = data.results.map((movie) => {
			const movieObject = {
				id: movie.id,
				movieName: movie.titleText.text,
				startYear: movie.releaseYear?.year,
				endYear: movie.releaseYear?.endYear,
				releaseDate: makeDate(movie.releaseDate),
				primaryImage: movie.primaryImage?.url,
				createdBy: req.user.userId,
			};

			removeNullsAndUndefined(movieObject);

			return movieObject;
		});

		const movies = await Movie.create(moviesCollection);

		res.status(StatusCodes.CREATED).json({ movies });
	} catch (error) {
		console.log(error);
	}
};

module.exports = { getAllMovies, populateDB, createMovie };

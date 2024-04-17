const Movie = require("../models/Movie");
const { StatusCodes } = require("http-status-codes");
const { BadRequestError, NotFoundError } = require("../errors");
const data = require("../mockData");
const { removeNullsAndUndefined, makeDate } = require("../helpers");

// Movie sample
// "movies": {
// 	"id": "tt0025547",
// 	"movieName": "Márciusi mese",
// 	"status": "planing to watch",
// 	"userScore": "1",
// 	"startYear": "1934",
// 	"releaseDate": "{day:4, month:3, year:1934}",
// 	"primaryImage": "https://m.media-amazon.com/images/M/MV5BZTZkMDM4NzMtN2ZiOC00NDFiLWEzZjQtYzY1ZWJmN2UwYWE0XkEyXkFqcGdeQXVyNzA1OTk3Mw@@._V1_.jpg",
// 	"createdBy": "661de76ac4011590d330c1fa",
// 	"_id": "661f1cab320c6a9783f0d1a3",
// 	"createdAt": "2024-04-17T00:49:47.413Z",
// 	"updatedAt": "2024-04-17T00:49:47.413Z",
// 	"__v": 0
// }

const getAllMovies = async (req, res) => {
	const { sort, movieName } = req.query;

	const queryObject = {};

	if (movieName) {
		queryObject.movieName = { $regex: movieName, $options: "i" };
	}

	let result = Movie.find(queryObject);

	if (sort) {
		result = result.sort(sort);
	} else {
		result = result.sort("createdAt");
	}

	const limit = parseInt(req.query.limit) || 20;
	const skip = (parseInt(req.query.page) - 1) * limit || 0;

	result = result.skip(skip).limit(limit);

	const movies = await result;
	res.status(StatusCodes.OK).json({ nHits: movies.length, movies });
};

const getSingleMovie = async (req, res) => {
	if (!req.params) throw new BadRequestError("Bad params");

	const { id, movieName, status, userScore, releaseYear, limit, sort } =
		req.params;
	const result = await Movie.find({
		occupation: /host/,
		"name.last": "Ghost",
		age: { $gt: 17, $lt: 66 },
		likes: { $in: ["vaporizing", "talking"] },
	})
		.limit(10)
		.sort({ occupation: -1 })
		.select({ name: 1, occupation: 1 })
		.exec();
};

const updateSingleMovie = (req, res) => {
	res.send("update movie");
};

const deleteSingleMovie = (req, res) => {
	res.send("delete movie");
};

const createMovie = async (req, res) => {
	const { user, body } = req;
	removeNullsAndUndefined(body);
	const movie = await Movie.create({
		createdBy: user.userId,
		...body,
	});

	res.status(StatusCodes.CREATED).json({ movie });
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

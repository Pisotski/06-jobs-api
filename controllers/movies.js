const Movie = require("../models/Movie");
const { StatusCodes } = require("http-status-codes");
const { BadRequestError, NotFoundError } = require("../errors");
const data = require("../mockData");
const { removeNullsAndUndefined, makeDate } = require("../helpers");
const mongoose = require("mongoose");
require("colors");

// Movie sample
// "movies": {
// 	"id": "tt0025547",
// 	"movieName": "Márciusi mese",
// 	"status": "planing_to_watch",
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
	// getAllMovies /?limit=5&sort=startYear&page=1&movieName=x-men

	const { sort, movieName } = req.query;
	const { userId, name } = req.user;

	const queryObject = { createdBy: userId };

	if (movieName) queryObject.movieName = { $regex: movieName, $options: "i" };

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
	if (!movies) throw new NotFoundError(`no movies for ${name} found`);

	res.status(StatusCodes.OK).json({ nHits: movies.length, movies });
};

const findMovie = async (req, res) => {
	const { id } = req.params;
	const { userId } = req.user;

	if (!id) throw new BadRequestError("no id provided");
	const movie = await Movie.findOne({ createdBy: userId, _id: id });
	if (!movie) throw new NotFoundError("movie not found");
	res.status(StatusCodes.OK).json({ movie });
};

const updateMovie = async (req, res) => {
	const { userId } = req.user;
	const { id } = req.params;
	if (!req.body.status && !req.body.userScore)
		throw new BadRequestError("nothing to update");
	const queryObject = { createdBy: userId, _id: id };
	const fieldsToUpdate = {
		status: req.body.status,
		userScore: req.body.userScore,
	};
	const movie = await Movie.findOneAndUpdate(queryObject, fieldsToUpdate, {
		new: true,
		runValidators: true,
	});
	if (!movie) throw new NotFoundError("movie not found");
	res.status(StatusCodes.OK).json({ updatedMovie: movie });
};

const removeMovie = async (req, res) => {
	const { userId } = req.user;
	const { id } = req.params;
	console.log(id);
	if (mongoose.isValidObjectId({ _id: id }))
		throw new BadRequestError("please provide a valid id");
	const movie = await Movie.findOneAndDelete({ createdBy: userId, _id: id });
	if (!movie) throw new NotFoundError("movie not found");

	res.status(StatusCodes.OK).json({ deletedMovie: movie });
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
};

module.exports = {
	getAllMovies,
	populateDB,
	createMovie,
	findMovie,
	updateMovie,
	removeMovie,
};

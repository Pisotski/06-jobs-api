require("dotenv").config();
require("express-async-errors");
require("colors");

const helmet = require("helmet");
const cors = require("cors");
const xss = require("xss-clean");
const rateLimiter = require("express-rate-limit");

const express = require("express");
const app = express();
const connectDB = require("./db/connect");
const moviesRouter = require("./routes/movies");
const authRouter = require("./routes/auth");
const { authMiddleware } = require("./middleware/authentication");

// error handler
const notFoundMiddleware = require("./middleware/not-found");
const errorHandlerMiddleware = require("./middleware/error-handler");
const limiter = rateLimiter({
	windowMs: 15 * 60 * 1000,
	limit: 100,
});

app.set("trust proxy", 1);
app.use(limiter);
app.use(express.json());
app.use(helmet());
app.use(cors());
app.use(xss());

// extra packages

// routes
app.get("/", (req, res) => {
	res.send("jobs api");
});

app.use("/api/v1/movies", authMiddleware, moviesRouter);
app.use("/api/v1/auth", authRouter);

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 3000;

const start = async () => {
	try {
		await connectDB(process.env.MONGO_URI);
		app.listen(port, () =>
			console.log(`Server is listening on port ${port}...`.blue)
		);
	} catch (error) {
		console.log(error);
	}
};

start();

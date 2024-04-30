import { enableInput, inputEnabled, message, setDiv, token } from "./index.js";
import { showJobs } from "./jobs.js";

let addEditDiv = null;
let addingJob = null;

let movieId = null;
let movieName = null;
let startYear = null;
let endYear = null;
let releaseDate = null;
let primaryImage = null;
let rating = null;

export const handleAddEdit = () => {
	addEditDiv = document.getElementById("edit-movie");
	movieId = document.getElementById("movieId");
	movieName = document.getElementById("movieName");
	startYear = document.getElementById("startYear");
	endYear = document.getElementById("endYear");
	releaseDate = document.getElementById("releaseDate");
	primaryImage = document.getElementById("primaryImage");
	rating = document.getElementById("rating");
	addingJob = document.getElementById("adding-job");

	const editCancel = document.getElementById("edit-cancel");

	addEditDiv.addEventListener("click", async (e) => {
		if (inputEnabled && e.target.nodeName === "BUTTON") {
			if (e.target === addingJob) {
				enableInput(false);

				let method = "POST";
				let url = "/api/v1/movies/addMovie";

				if (addingJob.textContent === "update") {
					method = "PATCH";
					url = `/api/v1/movies/myMovies/${addEditDiv.dataset.id}`;
				}

				try {
					const response = await fetch(url, {
						method: method,
						headers: {
							"Content-Type": "application/json",
							Authorization: `Bearer ${token}`,
						},
						body: JSON.stringify({
							id: movieId.value,
							movieName: movieName.value,
							startYear: startYear.value,
							endYear: endYear.value,
							releaseDate: releaseDate.value,
							primaryImage: primaryImage.value,
							userScore: rating.value,
						}),
					});

					const data = await response.json();
					if (response.status === 200 || response.status === 201) {
						if (response.status === 200) {
							// a 200 is expected for a successful update
							message.textContent = "The job entry was updated.";
						} else {
							// a 201 is expected for a successful create
							message.textContent = "The job entry was created.";
						}

						movieId.value = "";
						movieName.value = "";
						startYear.value = "";
						endYear.value = "";
						releaseDate.value = "";
						primaryImage.value = "";
						rating.value = "";

						showJobs();
					} else {
						message.textContent = data.msg;
					}
				} catch (err) {
					console.log(err);
					message.textContent = "A communication error occurred.";
				}
				enableInput(true);
			} else if (e.target === editCancel) {
				message.textContent = "";
				showJobs();
			}
		}
	});
};

export const showAddEdit = async (id) => {
	if (!id) {
		movieId.value = "";
		movieName.value = "";
		startYear.value = "";
		endYear.value = "";
		releaseDate.value = "";
		primaryImage.value = "";
		addingJob.textContent = "add";
		message.textContent = "";

		setDiv(addEditDiv);
	} else {
		enableInput(false);

		try {
			const response = await fetch(`/api/v1/movies/myMovies/${id}`, {
				method: "GET",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
			});

			const data = await response.json();
			if (response.status === 200) {
				movieId.value = data.movie.id;
				movieName.value = data.movie.movieName;
				startYear.value = data.movie.startYear;
				endYear.value = data.movie.endYear;
				releaseDate.value = data.movie.releaseDate;
				primaryImage.value = data.movie.primaryImage;
				addingJob.textContent = "update";
				message.textContent = "";

				addEditDiv.dataset.id = id;

				setDiv(addEditDiv);
			} else {
				// might happen if the list has been updated since last display
				message.textContent = "The jobs entry was not found";
				showJobs();
			}
		} catch (err) {
			console.log(err);
			message.textContent = "A communications error has occurred.";
			showJobs();
		}

		enableInput(true);
	}
};

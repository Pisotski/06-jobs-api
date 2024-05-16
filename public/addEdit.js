import { enableInput, inputEnabled, message, setDiv, token } from "./index.js";
import { showJobs } from "./jobs.js";
import { normalizeDate } from "./helpers.js";

let addEditDiv = null;
let addingJob = null;

let movieName = null;
let releaseDate = null;
let primaryImage = null;
let status = null;
let userScore = null;

export const handleAddEdit = () => {
	addEditDiv = document.getElementById("edit-movie");
	movieName = document.getElementById("movieName");
	releaseDate = document.getElementById("releaseDate");
	primaryImage = document.getElementById("primaryImage");
	status = document.getElementById("status");
	userScore = document.getElementById("userScore");
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
							movieName: movieName.value,
							releaseDate: releaseDate.value,
							primaryImage: primaryImage.value,
							status: status.value,
							userScore: userScore.value,
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

						movieName.innerHTML = "";
						releaseDate.innerHTML = "";
						primaryImage.value = "";

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
		movieName.value = "";
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
				movieName.value = data.movie.movieName;
				releaseDate.value = normalizeDate(data.movie.releaseDate);
				primaryImage.value = data.movie.primaryImage;
				status.value = data.movie.status;
				userScore.value = data.movie.userScore;
				addingJob.textContent = "update";
				message.textContent = "";

				addEditDiv.dataset.id = id;

				setDiv(addEditDiv);
			} else {
				// might happen if the list has been updated since last display
				message.textContent = "The jobs entry was not found";
				showJobs();
			}
			``;
		} catch (err) {
			console.log(err);
			message.textContent = "A communications error has occurred.";
			showJobs();
		}

		enableInput(true);
	}
};

export const deleteMovie = async (id, element) => {
	try {
		const response = await fetch(`/api/v1/movies/myMovies/${id}`, {
			method: "DELETE",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${token}`,
			},
		});
		const data = await response.json();
		if (response.status === 200) {
			message.textContent = `${data.deletedMovie.movieName} deleted`;
			element.parentNode.remove();
		} else {
			message.textContent = `movie can't be deleted at this time, try again later`;
		}
	} catch (err) {
		console.log(err);
		message.textContent = "A communication error occurred.";
	}
};

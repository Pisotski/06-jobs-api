import {
	inputEnabled,
	setDiv,
	message,
	setToken,
	token,
	enableInput,
} from "./index.js";
import { showLoginRegister } from "./loginRegister.js";
import { showAddEdit, deleteMovie } from "./addEdit.js";
import { normalizeDate } from "./helpers.js";

let jobsDiv = null;
let jobsTable = null;
let jobsTableHeader = null;

export const handleJobs = () => {
	jobsDiv = document.getElementById("jobs");
	const logoff = document.getElementById("logoff");
	const addJob = document.getElementById("add-job");
	jobsTable = document.getElementById("jobs-table");
	jobsTableHeader = document.getElementById("jobs-table-header");

	jobsDiv.addEventListener("click", (e) => {
		if (inputEnabled && e.target.nodeName === "BUTTON") {
			if (e.target === addJob) {
				showAddEdit(null);
			} else if (e.target === logoff) {
				setToken(null);

				message.textContent = "You have been logged off.";

				jobsTable.replaceChildren([jobsTableHeader]);

				showLoginRegister();
			} else if (e.target.classList.contains("editButton")) {
				message.textContent = "";
				showAddEdit(e.target.dataset.id);
			} else if (e.target.classList.contains("deleteButton")) {
				message.textContent = "";
				deleteMovie(e.target.dataset.id, e.target.parentNode);
			}
		}
	});
};

export const showJobs = async () => {
	try {
		enableInput(false);

		const response = await fetch("/api/v1/movies", {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${token}`,
			},
		});

		let data = await response.json();
		let children = [jobsTableHeader];

		if (response.status === 200) {
			if (data.count === 0) {
				jobsTable.replaceChildren(...children); // clear this for safety
			} else {
				for (let i = 0; i < data.movies.length; i++) {
					let rowEntry = document.createElement("tr");
					const date =
						normalizeDate(data.movies[i].releaseDate) ||
						data.movies[i].releaseDate;
					const divStyles = {
						"background-image": "url(" + data.movies[i].primaryImage + ")",
					};
					let editButton = `<td><button type="button" class="editButton" data-id=${data.movies[i]._id}>edit</button></td>`;
					let deleteButton = `<td><button type="button" class="deleteButton" data-id=${data.movies[i]._id}>delete</button></td>`;
					let rowHTML = `
              <td>${data.movies[i].movieName}</td>
              <td>${date}</td>
              <td class="movie-image">
			  
			  <div style="background-image: url(${data.movies[i].primaryImage})"; width: 20px; height: 20px"/></td>
			  
			  <td>${data.movies[i].status}</td>
              <td>${data.movies[i].userScore}</td>
              <div>${editButton}${deleteButton}</div>`;

					rowEntry.innerHTML = rowHTML;
					children.push(rowEntry);
				}
				jobsTable.replaceChildren(...children);
			}
		} else {
			message.textContent = data.msg;
		}
	} catch (err) {
		console.log(err);
		message.textContent = "A communication error occurred.";
	}
	enableInput(true);
	setDiv(jobsDiv);
};

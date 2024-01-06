import * as gaming from "./gameboard.js";

// Add your JavaScript logic here
export const playerGridElement = document.getElementById("playerGrid");
export const computerGridElement = document.getElementById("computerGrid");
export const nameDialog = document.getElementById("nameDialog");
export const playerNameDisplay = document.getElementById("playerName");

// Function to create grid cells
export function createGrid(gridElement, player = "computer") {
	for (let y = 9; y > -1; y--) {
		for (let x = 0; x < 10; x++) {
			const cell = document.createElement("div");
			cell.classList.add(`cell`);
			cell.classList.add(`${player}Cell`);
			cell.setAttribute("grid", `${x},${y}`);
			gridElement.appendChild(cell);
		}
	}
}

export function getName() {
	nameDialog.style.visibility = "visible";
	nameDialog.addEventListener("submit", (x) => {
		x.preventDefault();
		let name = x.target[0].value;
		x.target.reset();
		nameDialog.style.visibility = "hidden";
		playerNameDisplay.textContent = name;
	});
}

export function gameMode(logic) {
	createGrid(playerGridElement);
	createGrid(computerGridElement);
	getName();
}

export function placeShips() {
	let playerCells = Array.from(document.getElementsByClassName("playerCell"));
	playerCells.forEach((el) => {
		el.addEventListener("click", (x) => {
			let xYCoor;
			el.attributes.grid.value;
		});
	});
}

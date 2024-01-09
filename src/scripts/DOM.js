import * as gaming from "./gameboard.js";
import logoImg from "../assets/imgbin_battleship-wii-u-xbox-360-nintendo-ds-png.png";
const logo = document.getElementById("logo");
logo.src = logoImg;
import battleshipH from "../assets/battleshipH.png";
import carrierH from "../assets/carrierH.png";
import destroyerH from "../assets/destroyerH.png";
import patrolH from "../assets/patrolH.png";
import subH from "../assets/subH.png";

const battleshipImg = document.createElement("img");
const carrierImg = document.createElement("img");
const destroyerImg = document.createElement("img");
const patrolImg = document.createElement("img");
const subImg = document.createElement("img");
battleshipImg.src = battleshipH;
battleshipImg.setAttribute("id", "battleship");
carrierImg.src = carrierH;
carrierImg.setAttribute("id", "carrier");
destroyerImg.src = destroyerH;
destroyerImg.setAttribute("id", "destroyer");
patrolImg.src = patrolH;
patrolImg.setAttribute("id", "patrol");
subImg.src = subH;
subImg.setAttribute("id", "sub");

const shipArr = [carrierImg, battleshipImg, destroyerImg, subImg, patrolImg];

export const playerGridElement = document.getElementById("playerGrid");
export const computerGridElement = document.getElementById("computerGrid");
const shipGrid = document.getElementById("shipGrid");
const nameDialog = document.getElementById("nameDialog");
const playerNameDisplay = document.getElementById("playerName");
const placeShipNotice = document.getElementById("placeShipNotice");
const vertHorz = document.getElementById("vertHorzWrap");
const vertHorzChoice = document.getElementById("vertHorzChoice");

export function createGrid(gridElement, player = "computer") {
	for (let y = 1; y < 11; y++) {
		for (let x = 1; x < 11; x++) {
			const cell = document.createElement("div");
			cell.classList.add(`cell`);
			cell.classList.add(`${player}Cell`);
			cell.setAttribute("grid", `${y},${x}`);
			gridElement.appendChild(cell);
		}
	}
}

export function getName(gameLogic) {
	nameDialog.style.visibility = "visible";
	nameDialog.addEventListener("submit", (x) => {
		x.preventDefault();
		let name = x.target[0].value;
		x.target.reset();
		nameDialog.style.visibility = "hidden";
		playerNameDisplay.textContent = name;
		placeShipVisibility();
		placeShips(shipArr, gameLogic.player1.board);
	});
}

export function placeShips(shipArr, board, direction = "horizontal") {
	console.log(board);
	let playerCells = Array.from(document.getElementsByClassName("playerCell"));
	document.direction.vertHorz[1].checked = true;
	let ship = shipArr.shift();
	let length;
	switch (ship) {
		case carrierImg:
			length = 5;
			break;
		case battleshipImg:
			length = 4;
			break;
		case destroyerImg:
			length = 3;
			break;
		case subImg:
			length = 3;
			break;
		case patrolImg:
			length = 2;
			break;
	}
	let vertChangeL = (x) => {
		direction = direction === "horizontal" ? "vertical" : "horizontal";
		controlShipDirection(x, ship, direction);
	};
	let gridL = (x) => gridShipPlace(x, direction);
	shipGrid.append(ship);
	vertHorzChoice.addEventListener("change", vertChangeL);

	playerCells.forEach((el) => {
		el.addEventListener("mouseover", gridL);
		el.addEventListener("click", clickL);
	});

	function clickL(el) {
		let xYCoor = ship.style.gridArea.split(" / ");
		board.placeShip(length, xYCoor, direction);
		console.log(board);
		playerCells.forEach((x) => {
			x.removeEventListener("mouseover", gridL);
			x.removeEventListener("click", clickL);
		});
		vertHorzChoice.removeEventListener("change", vertChangeL);
		if (shipArr.length > 0) {
			direction = "horizontal";
			placeShips(shipArr, board, direction);
		} else {
			alert("Game Start");
			return;
		}
	}

	function gridShipPlace(x, direction) {
		let coor = x.target.attributes.grid.value.split(",");
		if (direction === "horizontal" && coor[1] >= 11 - length) {
			ship.style.gridArea = `${coor[0]}/${11 - length}`;
		} else if (direction === "vertical" && coor[0] <= length) {
			ship.style.gridArea = `${length}/${coor[1]}`;
		} else {
			ship.style.gridArea = `${coor[0]}/${coor[1]}`;
		}
	}
}

function controlShipDirection(x, ship, direction) {
	direction = x.target.value;
	let pixWidth = ship.clientWidth;
	let hold = ship.style.gridArea.split("/");
	if (direction === "vertical") {
		if (ship.style.gridArea === "" || ship.style.gridArea.split("/")[0] <= ship.length) {
			hold = ship.style.gridArea.split("/");
			ship.style.gridArea = hold.length === 1 ? `${length}/1` : `${length}/${hold[1]}`;
		}
		ship.classList.add("vertical");
	} else {
		if (ship.style.gridArea.split("/")[0] >= 11 - length) {
			hold = ship.style.gridArea.split("/");
			ship.style.gridArea = `${hold[0]}/${11 - length}`;
		}
		ship.classList.remove("vertical");
	}
}

function placeShipVisibility() {
	if (placeShipNotice.style.visibility !== "visible") {
		playerNameDisplay.style.paddingTop = "30px";
		placeShipNotice.style.visibility = "visible";
		vertHorz.style.visibility = "visible";
	} else {
		playerNameDisplay.style.paddingTop = "0px";
		placeShipNotice.style.visibility = "hidden";
		vertHorz.style.visibility = "hidden";
		piecePick.style.visibility = "hidden";
	}
}

export function gameMode(gameLogic) {
	createGrid(playerGridElement, "player");
	createGrid(computerGridElement);
	getName(gameLogic);
}

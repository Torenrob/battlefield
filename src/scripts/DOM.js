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
battleshipImg.classList.add("battleship");
carrierImg.src = carrierH;
carrierImg.classList.add("carrier");
destroyerImg.src = destroyerH;
destroyerImg.classList.add("destroyer");
patrolImg.src = patrolH;
patrolImg.classList.add("patrol");
subImg.src = subH;
subImg.classList.add("sub");

const battleshipImgComp = document.createElement("img");
const carrierImgComp = document.createElement("img");
const destroyerImgComp = document.createElement("img");
const patrolImgComp = document.createElement("img");
const subImgComp = document.createElement("img");
battleshipImgComp.src = battleshipH;
battleshipImgComp.classList.add("battleship");
carrierImgComp.src = carrierH;
carrierImgComp.classList.add("carrier");
destroyerImgComp.src = destroyerH;
destroyerImgComp.classList.add("destroyer");
patrolImgComp.src = patrolH;
patrolImgComp.classList.add("patrol");
subImgComp.src = subH;
subImgComp.classList.add("sub");

const shipArrPlayer = [carrierImg, battleshipImg, destroyerImg, subImg, patrolImg];
const shipArrComp = [carrierImgComp, battleshipImgComp, destroyerImgComp, subImgComp, patrolImgComp];

export const playerGridElement = document.getElementById("playerGrid");
export const computerGridElement = document.getElementById("computerGrid");
const shipGrid = document.getElementById("shipGrid");
const nameDialog = document.getElementById("nameDialog");
const playerNameDisplay = document.getElementById("playerName");
const placeShipNotice = document.getElementById("placeShipNotice");
const vertHorz = document.getElementById("vertHorzWrap");
const vertHorzChoice = document.getElementById("vertHorzChoice");

function createGrid(gridElement, player = "computer") {
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

function getName(gameLogic) {
	nameDialog.style.visibility = "visible";
	nameDialog.addEventListener("submit", (x) => {
		x.preventDefault();
		let name = x.target[0].value;
		x.target.reset();
		nameDialog.style.visibility = "hidden";
		playerNameDisplay.textContent = name;
		placeShipVisibility();
		placeShips(shipArrPlayer, gameLogic.player1.board);
		// placeShips(shipArrComp, gameLogic.computer.board);
	});
}

function placeShips(shipArr, board, direction = "horizontal", occupiedSquares = []) {
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
		controlShipDirection(x, ship, direction, length);
	};

	let gridL = (x) => gridShipPlace(x, direction);
	shipGrid.append(ship);
	vertHorzChoice.addEventListener("change", vertChangeL);

	playerCells.forEach((el) => {
		el.addEventListener("mouseover", gridL);
		el.addEventListener("click", clickL);
	});

	function clickL(el) {
		if (ship.classList.contains("shipOverlap")) {
			return;
		}
		let xYCoor = ship.style.gridArea.split(" / ");
		occupiedSquares = occupiedSquares.concat(board.placeShip(length, xYCoor, direction));
		playerCells.forEach((x) => {
			x.removeEventListener("mouseover", gridL);
			x.removeEventListener("click", clickL);
		});
		vertHorzChoice.removeEventListener("change", vertChangeL);
		if (shipArr.length > 0) {
			direction = "horizontal";
			placeShips(shipArr, board, direction, occupiedSquares);
		} else {
			alert("Game Start");
			placeShipVisibility();
			return;
		}
	}

	function gridShipPlace(x, direction) {
		let coor = x.target.attributes.grid.value.split(",");
		let shipSpan = [];
		if (direction === "horizontal") {
			if (coor[1] >= 11 - length) {
				ship.style.gridArea = `${coor[0]}/${11 - length}`;
			} else {
				ship.style.gridArea = `${coor[0]}/${coor[1]}`;
			}
			let shipGridRoot = ship.style.gridArea.split(" / ");
			for (let i = 0; i < length; i++) {
				shipSpan.push(`${shipGridRoot[0]},${Number(shipGridRoot[1]) + i}`);
			}
		} else if (direction === "vertical") {
			if (coor[0] <= length) {
				ship.style.gridArea = `${length}/${coor[1]}`;
			} else {
				ship.style.gridArea = `${coor[0]}/${coor[1]}`;
			}
			let shipGridRoot = ship.style.gridArea.split(" / ");
			for (let i = 0; i < length; i++) {
				shipSpan.push(`${Number(shipGridRoot[0]) - i},${shipGridRoot[1]}`);
			}
		}

		console.log(shipSpan);
		console.log(occupiedSquares);

		if (shipSpan.some((space) => occupiedSquares.includes(space))) {
			ship.classList.add("shipOverlap");
		} else {
			ship.classList.remove("shipOverlap");
		}
	}

	function controlShipDirection(x, ship, direction, length) {
		direction = x.target.value;
		let hold = ship.style.gridArea.split(" / ");
		if (direction === "vertical") {
			if (hold[0] === "" || hold[0] <= length) {
				ship.style.gridArea = hold.length === 1 ? `${length}/1` : `${length}/${hold[1]}`;
			}
			ship.classList.add("vertical");
		} else {
			if (hold[1] >= 11 - length) {
				ship.style.gridArea = `${hold[0]}/${11 - length}`;
			}
			ship.classList.remove("vertical");
		}
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
	}
}

function placeCompShips() {}

export function gameMode(gameLogic) {
	createGrid(playerGridElement, "player");
	createGrid(computerGridElement);
	getName(gameLogic);
}

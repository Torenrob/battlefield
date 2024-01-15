import random from "lodash/random.js";
import * as gaming from "./gameboard.js";
import logoImg from "../assets/imgbin_battleship-wii-u-xbox-360-nintendo-ds-png.png";
import { compAttack } from "./compAttack.js";
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
const compShipGrid = document.getElementById("compShipGrid");
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
		placeShips(shipArrPlayer, gameLogic, "player");
	});
}

function placeShips(shipArr, gameLogic, user, direction = "horizontal", occupiedSquares = []) {
	let board = user === "player" ? gameLogic.player1.board : gameLogic.computer.board;
	let playerCells = Array.from(document.getElementsByClassName("playerCell"));
	document.direction.vertHorz[1].checked = true;
	let ship = shipArr.shift();
	let length;

	switch (ship.classList[0]) {
		case "carrier":
			length = 5;
			break;
		case "battleship":
			length = 4;
			break;
		case "destroyer":
			length = 3;
			break;
		case "sub":
			length = 3;
			break;
		case "patrol":
			length = 2;
			break;
	}

	if (user === "comp") {
		direction = random(1, 2) === 1 ? "horizontal" : "vertical";
		let xYCoor = direction === "horizontal" ? [`${random(1, 10)}`, `${random(1, 11 - length)}`] : [`${random(length, 10)}`, `${random(1, 10)}`];
		let shipSqrs = board.placeShip(length, xYCoor, direction, ship);
		if (shipSqrs.some((x) => occupiedSquares.includes(x))) {
			shipArr.push(ship);
			board.ships.pop();
			placeShips(shipArr, gameLogic, "comp", direction, occupiedSquares);
		} else {
			occupiedSquares = occupiedSquares.concat(shipSqrs);
			if (shipArr.length > 0) {
				placeShips(shipArr, gameLogic, "comp", direction, occupiedSquares);
			} else {
				alert("Comp Created - Game Start");
				gameLoop(gameLogic, gameLogic.player1);
			}
		}
	} else {
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

		function clickL() {
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
				placeShips(shipArr, gameLogic, "player", direction, occupiedSquares);
			} else {
				placeShipVisibility();
				placeShips(shipArrComp, gameLogic, "comp");
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

function gameLoop(gameLogic, attackingPlayer = null) {
	const compCells = Array.from(document.getElementsByClassName("computerCell"));
	attackingPlayer = attackingPlayer ? attackingPlayer : gameLogic.player1;
	let attackedPlayer = attackingPlayer === gameLogic.player1 ? gameLogic.computer : gameLogic.player1;
	if (attackedPlayer === gameLogic.computer) {
		compCells.forEach((cell) => {
			cell.addEventListener("click", (x) => takeAttack(cell, attackedPlayer, compCells, gameLogic));
		});
	} else {
		compAttack(attackedPlayer);
	}
}

function takeAttack(sqrTarget, attackedPlayer, compCells, gameLogic) {
	let sqr = sqrTarget.attributes.grid.value.split(",");
	let result = attackedPlayer.board.receiveAttack(sqr[1], sqr[0]);
	attackResultID(sqr, result, "computer");
	compCells.forEach((x) => x.removeEventListener("click", (x) => takeAttack(cell, attackedPlayer, compCells)));
	setTimeout(() => displaySunkCompShip(attackedPlayer), 2400);
	gameLoop(gameLogic, gameLogic.computer);
}

function displaySunkCompShip(computerPlayer) {
	let ships = computerPlayer.board.ships;
	ships.forEach((ship) => {
		if (ship.newShip.sunk) {
			ship.shipEl.style.gridArea = `${ship.root[0]}/${ship.root[1]}`;
			if (ship.direction === "vertical") {
				ship.shipEl.classList.add("vertical");
			}
			compShipGrid.append(ship.shipEl);
		}
	});
}

export function attackResultID(choice, result, user) {
	let def = "miss";

	let el = document.querySelector(`.${user}Cell[grid='${choice[0]},${choice[1]}']`);
	switchCompChoice(el, def);
	setTimeout(() => switchCompChoice(el, def), 300);
	setTimeout(() => switchCompChoice(el, def), 600);
	setTimeout(() => switchCompChoice(el, def), 900);
	setTimeout(() => switchCompChoice(el, def), 1200);
	setTimeout(() => switchCompChoice(el, def), 1500);
	setTimeout(() => switchCompChoice(el, result), 1800);
	setTimeout(() => switchCompChoice(el), 2100);
	setTimeout(() => switchCompChoice(el, result), 2400);

	function switchCompChoice(elem, result) {
		if (elem.hasAttribute("attack")) {
			elem.removeAttribute("attack");
		} else {
			elem.setAttribute("attack", `${result}`);
		}
	}
}

export function gameMode(gameLogic) {
	createGrid(playerGridElement, "player");
	createGrid(computerGridElement);
	getName(gameLogic);
}

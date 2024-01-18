import random from "lodash/random.js";
import { game, startGame } from "./index.js";
import * as util from "./utils.js";
import logoImg from "../assets/Untitled_Export-WVRdLY5XF.png";
import { compAttack } from "./compAttack.js";
const logo = document.getElementById("logo");
logo.src = logoImg;
import battleshipH from "../assets/battleshipH.png";
import carrierH from "../assets/carrierH.png";
import destroyerH from "../assets/destroyerH.png";
import patrolH from "../assets/patrolH.png";
import subH from "../assets/subH.png";
import { round } from "lodash";

const battleshipImg = document.createElement("img");
const carrierImg = document.createElement("img");
const destroyerImg = document.createElement("img");
const patrolImg = document.createElement("img");
const subImg = document.createElement("img");
battleshipImg.src = battleshipH;
battleshipImg.classList.add("Battleship");
carrierImg.src = carrierH;
carrierImg.classList.add("Carrier");
destroyerImg.src = destroyerH;
destroyerImg.classList.add("Destroyer");
patrolImg.src = patrolH;
patrolImg.classList.add("Patrol");
subImg.src = subH;
subImg.classList.add("Sub");

const battleshipImgComp = document.createElement("img");
const carrierImgComp = document.createElement("img");
const destroyerImgComp = document.createElement("img");
const patrolImgComp = document.createElement("img");
const subImgComp = document.createElement("img");
battleshipImgComp.src = battleshipH;
battleshipImgComp.classList.add("Battleship");
carrierImgComp.src = carrierH;
carrierImgComp.classList.add("Carrier");
destroyerImgComp.src = destroyerH;
destroyerImgComp.classList.add("Destroyer");
patrolImgComp.src = patrolH;
patrolImgComp.classList.add("Patrol");
subImgComp.src = subH;
subImgComp.classList.add("Sub");

export const playerGridElement = document.getElementById("playerGrid");
export const computerGridElement = document.getElementById("computerGrid");
const shipGrid = document.createElement("div");
shipGrid.setAttribute("id", "shipGrid");
const playerGrid = document.getElementById("playerGrid");
const compShipGrid = document.createElement("div");
compShipGrid.setAttribute("id", "compShipGrid");
const computerGrid = document.getElementById("computerGrid");
const nameDialog = document.getElementById("nameDialog");
const playerNameDisplay = document.getElementById("playerName");
const placeShipNotice = document.getElementById("placeShipNotice");
const vertHorz = document.getElementById("vertHorzWrap");
const vertHorzChoice = document.getElementById("vertHorzChoice");
const afterAttackMessage = document.getElementById("afterAttackMessage");
const afterAttackDiv = document.getElementById("afterAttackDiv");
const playerName = document.getElementById("playerName");

export function gameMode(gameLogic, reset = null) {
	createGrid(playerGridElement, shipGrid, "player");
	createGrid(computerGridElement, compShipGrid);
	getName(gameLogic, reset);
}

function createGrid(gridElement, shipGrid, player = "computer") {
	gridElement.append(shipGrid);
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

function getName(gameLogic, reset) {
	const shipArrPlayer = [carrierImg, battleshipImg, destroyerImg, subImg, patrolImg];
	if (reset) {
		gameLogic.player1.name = reset;
		placeShipVisibility();
		placeShips(shipArrPlayer, gameLogic, "player");
	} else {
		nameDialog.style.visibility = "visible";
		nameDialog.addEventListener("submit", (x) => {
			x.preventDefault();
			let name = x.target[0].value;
			x.target.reset();
			nameDialog.style.visibility = "hidden";
			playerNameDisplay.textContent = name;
			gameLogic.player1.name = name;
			placeShipVisibility();
			placeShips(shipArrPlayer, gameLogic, "player");
		});
	}
}

function placeShips(shipArr, gameLogic, user, direction = "horizontal", occupiedSquares = []) {
	let board = user === "player" ? gameLogic.player1.board : gameLogic.computer.board;
	let playerCells = Array.from(document.getElementsByClassName("playerCell"));
	document.direction.vertHorz[1].checked = true;
	let ship = shipArr.shift();
	let length;

	switch (ship.classList[0]) {
		case "Carrier":
			length = 5;
			break;
		case "Battleship":
			length = 4;
			break;
		case "Destroyer":
			length = 3;
			break;
		case "Sub":
			length = 3;
			break;
		case "Patrol":
			length = 2;
			break;
	}

	if (user === "comp") {
		direction = random(1, 2) === 1 ? "horizontal" : "vertical";
		let xYCoor = direction === "horizontal" ? [`${random(1, 10)}`, `${random(1, 11 - length)}`] : [`${random(length, 10)}`, `${random(1, 10)}`];
		let shipSqrs = board.placeShip(length, xYCoor, direction, ship.classList[0], ship);

		if (util.noShipOverlap(shipSqrs, occupiedSquares)) {
			shipArr.push(ship);
			board.ships.pop();
			placeShips(shipArr, gameLogic, "comp", direction, occupiedSquares);
		} else {
			occupiedSquares = occupiedSquares.concat(shipSqrs);
			if (shipArr.length > 0) {
				placeShips(shipArr, gameLogic, "comp", direction, occupiedSquares);
			} else {
				gameLoop();
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
			occupiedSquares = occupiedSquares.concat(board.placeShip(length, xYCoor, direction, ship.classList[0]));
			playerCells.forEach((x) => {
				x.removeEventListener("mouseover", gridL);
				x.removeEventListener("click", clickL);
			});
			vertHorzChoice.removeEventListener("change", vertChangeL);
			if (shipArr.length > 0) {
				direction = "horizontal";
				placeShips(shipArr, gameLogic, "player", direction, occupiedSquares);
			} else {
				const shipArrComp = [carrierImgComp, battleshipImgComp, destroyerImgComp, subImgComp, patrolImgComp];
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

let roundCount = 0;
function gameLoop() {
	afterAttackDiv.style.visibility = "hidden";
	if (roundCount % 2 === 0) {
		util.hoverSwicth();
		document.querySelector("#attackNotice").style.visibility = "visible";
		computerGrid.addEventListener("mouseup", takeAttack);
	} else {
		compAttack(game);
	}
	roundCount++;
}

let chosenSqrs = [];
function takeAttack(sqr) {
	sqr = sqr.target.attributes.grid.value.split(",");
	if (util.checkChosenSqr(sqr, chosenSqrs)) {
		roundCount--;
		util.hoverSwicth();
		gameLoop();
		return;
	}
	document.querySelector("#attackNotice").style.visibility = "hidden";
	chosenSqrs.push(sqr);
	computerGrid.removeEventListener("mouseup", takeAttack);
	util.hoverSwicth();
	let result = game.computer.board.receiveAttack(sqr[1], sqr[0]);
	attackResultID(sqr, result, "computer");
	setTimeout(() => {
		displaySunkCompShip();
	}, 1500);
}

function displaySunkCompShip() {
	let ships = game.computer.board.ships;
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
	let attacker = user === "player" ? "computer" : game.player1;
	let el = document.querySelector(`.${user}Cell[grid='${choice[0]},${choice[1]}']`);
	switchCompChoice(el, def);
	setTimeout(() => switchCompChoice(el, def), 300);
	setTimeout(() => switchCompChoice(el, def), 600);
	setTimeout(() => switchCompChoice(el, result.str), 900);
	setTimeout(() => {
		switchCompChoice(el, result.str);
		afterAttackDisplay(attacker, result);
	}, 1200);

	function switchCompChoice(elem, result) {
		if (elem.hasAttribute("attack")) {
			elem.removeAttribute("attack");
		} else {
			elem.setAttribute("attack", `${result}`);
		}
	}
}

export function afterAttackDisplay(attacker, result) {
	const btn = document.querySelector("#afterAttackDiv>button");

	let message;
	if (attacker === game.player1) {
		switch (result.str) {
			case "hit":
				if (result.allShips) {
					endGame(attacker);
					return;
				}
				message = result.shipHit.sunk ? util.isShipSunk(attacker, result) : `${attacker.name}, it's a hit!`;
				break;
			case "miss":
				message = "Missed. Better luck next round!";
				break;
		}
	} else {
		switch (result.str) {
			case "hit":
				if (result.allShips) {
					endGame(attacker);
					return;
				}
				message = result.shipHit.sunk ? util.isShipSunk(attacker, result) : `${game.player1.name} your ${result.shipHit.name} has been hit.`;
				break;
			case "miss":
				message = "They missed! Your turn!";
				break;
		}
	}

	btn.innerText = "Continue";
	afterAttackMessage.innerText = message;
	afterAttackDiv.style.visibility = "visible";
	btn.removeEventListener("click", resetGame);
	btn.addEventListener("click", gameLoop);
}

function endGame(winner) {
	let message = winner === game.player1 ? `${winner.name}, you sunk all enemy ships! Victory is YOURS!` : `The enemy has sunk all of your ships! Lick your wounds and try again.`;
	const btn = document.querySelector("#afterAttackDiv>button");
	btn.removeEventListener("click", gameLoop);
	btn.innerText = "Start New Game";
	afterAttackMessage.innerText = message;
	afterAttackDiv.style.visibility = "visible";
	btn.addEventListener("click", resetGame);
}

function resetGame() {
	let name = playerName.innerText;
	afterAttackDiv.style.visibility = "hidden";
	roundCount = 0;
	chosenSqrs = [];
	playerGridElement.innerHTML = "";
	computerGridElement.innerHTML = "";
	shipGrid.innerHTML = "";
	compShipGrid.innerHTML = "";
	startGame(name);
}

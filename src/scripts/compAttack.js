import random from "lodash/random.js";
import { attackResultID } from "./DOM.js";

let pastChoices = [];

export function compAttack(game) {
	let choiceArray = [];
	let choice;
	for (let i = 0; i <= 10; i++) {
		let y = random(1, 10);
		let x = random(1, 10);
		choiceArray.push(`${y},${x}`);
		if (i != 10) continue;
		choice = choiceArray[choiceArray.length - 1].split(",");
		//Checks if final choice is in pastChoices array
		let repetition = pastChoices.some((x) => {
			if (x.toString() === choice.toString()) {
				return true;
			}
		});
		if (!repetition) continue;
		i--;
	}
	pastChoices.push(choice);
	let int = setInterval(() => {
		if (choiceArray.length > 0) {
			let sqr = choiceArray.shift();
			hoverCells(sqr);
		}
	}, 100);

	setTimeout(() => clearInterval(int), 1100);

	let result = game.player1.board.receiveAttack(choice[1], choice[0]);

	setTimeout(() => {
		attackResultID(choice, result, "player");
	}, 1100);
}

function hoverCells(sqr) {
	sqr = sqr.split(",");
	let el = document.querySelector(`[grid='${sqr[0]},${sqr[1]}']`);
	el.setAttribute("id", "compSelect");
	setTimeout(() => el.removeAttribute("id"), 120);
}

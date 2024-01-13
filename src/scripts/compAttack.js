import random from "lodash/random.js";

export function compAttack(player1, playerGrid) {
	let choiceArray = [];
	for (let i = 0; i <= 25; i++) {
		let y = random(1, 10);
		let x = random(1, 10);
		choiceArray.push(`${y},${x}`);
	}
	let choice = choiceArray[choiceArray.length - 1].split(",");
	let int = setInterval(() => {
		if (choiceArray.length > 0) {
			let sqr = choiceArray.shift();
			hoverCells(sqr);
		}
	}, 100);

	setTimeout(() => {
		clearInterval(int);
		let el = document.querySelector(`[grid='${choice[0]},${choice[1]}']`);
		el.setAttribute("game", "compChoice");
	}, 2500);
}

function hoverCells(sqr) {
	sqr = sqr.split(",");
	let el = document.querySelector(`[grid='${sqr[0]},${sqr[1]}']`);
	console.log(el);
	el.setAttribute("id", "compSelect");
	setTimeout(() => el.removeAttribute("id"), 100);
}

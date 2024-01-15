import random from "lodash/random.js";

let pastChoices = [];

export function compAttack(attackedPlayer) {
	let choiceArray = [];
	let choice;
	for (let i = 0; i <= 25; i++) {
		let y = random(1, 10);
		let x = random(1, 10);
		choiceArray.push(`${y},${x}`);
		if (i != 25) continue;
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

	let result = attackedPlayer.board.receiveAttack(choice[1], choice[0]);

	setTimeout(() => {
		clearInterval(int);
		let el = document.querySelector(`[grid='${choice[0]},${choice[1]}']`);
		switchCompChoice(el);
		setTimeout(() => switchCompChoice(el, result), 300);
		setTimeout(() => switchCompChoice(el, result), 600);
		setTimeout(() => switchCompChoice(el, result), 900);
		setTimeout(() => switchCompChoice(el, result), 1200);
		setTimeout(() => switchCompChoice(el, result), 1500);
		setTimeout(() => switchCompChoice(el, result), 1800);
		setTimeout(() => switchCompChoice(el, result), 2100);
		setTimeout(() => switchCompChoice(el, result), 2400);
	}, 2800);
}

function hoverCells(sqr) {
	sqr = sqr.split(",");
	let el = document.querySelector(`[grid='${sqr[0]},${sqr[1]}']`);
	el.setAttribute("id", "compSelect");
	setTimeout(() => el.removeAttribute("id"), 120);
}

function switchCompChoice(elem, result) {
	if (elem.hasAttribute("attack")) {
		elem.removeAttribute("attack");
	} else {
		elem.setAttribute("attack", `${result}`);
	}
}

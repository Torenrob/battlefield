export function noShipOverlap(shipSqrs, occupiedSquares) {
	return shipSqrs.some((x) => {
		return occupiedSquares.some((y) => {
			return x.toString() === y.toString();
		});
	});
}

export function hoverSwicth() {
	let cells = Array.from(document.querySelectorAll(".computerCell"));

	if (cells[0].classList.contains("hover")) {
		cells.forEach((x) => {
			x.classList.remove("hover");
			x.style.cursor = "auto";
		});
	} else {
		cells.forEach((x) => {
			x.classList.add("hover");
			x.style.cursor = "crosshair";
		});
	}
}

export function isShipSunk(attacker, result) {
	if (attacker !== "computer") return `${attacker.name}, you sunk their ${result.shipHit.name}!`;
	return `They sunk your ${result.shipHit.name}`;
}

export function checkChosenSqr(sqr, arr) {
	return arr.some((x) => x.toString() === sqr.toString());
}

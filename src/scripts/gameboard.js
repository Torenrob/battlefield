export class Ship {
	constructor(length, location) {
		this.length = length;
		this.timesHit = 0;
		this.sunk = false;
	}

	hit() {
		this.timesHit += 1;
		console.log(`Its a hit!`);
		this.isSunk();
	}

	isSunk() {
		if (this.timesHit === this.length) {
			this.sunk = true;
			console.log(`You sunk their ${this.length} spot ship!`);
		}
	}
}

export class gameBoard {
	constructor() {
		this.boardMap = this.buildBoard();
		this.ships = [];
		this.misses = [];
		this.allShipsSunk = false;
	}

	buildBoard() {
		let map = new Map();
		for (let x = 0; x < 10; x++) {
			for (let y = 0; y < 10; y++) {
				let square = new boardSquare(x, y);
				map.set(`${x},${y}`, square);
			}
		}
		map.forEach((square) => {
			square.setEdges(10, 10, map);
		});
		return map;
	}

	placeShip(length, squareSelected, direction) {
		let newShip = new Ship(length);
		let location = [];
		let count = 0;
		let q = [this.boardMap.get(squareSelected)];
		let visited = new Set();
		if (direction === "vertical") {
			while (count < length) {
				let curSqr = q.shift();
				location.push(`${curSqr.xAxis},${curSqr.yAxis}`);
				visited.add(curSqr);
				if (!visited.has(curSqr.up) && curSqr.up) {
					q.push(curSqr.up);
				}
				if (!visited.has(curSqr.down) && curSqr.down) {
					q.push(curSqr.down);
				}
				count++;
			}
		}
		if (direction === "horizontal") {
			while (count < length) {
				let curSqr = q.shift();
				location.push(`${curSqr.xAxis},${curSqr.yAxis}`);
				visited.add(curSqr);
				if (!visited.has(curSqr.left) && curSqr.left) {
					q.push(curSqr.left);
				}
				if (!visited.has(curSqr.right) && curSqr.right) {
					q.push(curSqr.right);
				}
				count++;
			}
		}
		location = location.sort();
		this.ships.push({ newShip, location });
	}

	receiveAttack(xAxis, yAxis) {
		let hitTrack = 0;
		for (let i = 0; i <= this.ships.length - 1; i++) {
			if (this.ships[i].location.includes(`${xAxis},${yAxis}`)) {
				this.ships[i].newShip.hit();
				hitTrack = 1;
				break;
			}
		}
		if (hitTrack === 0) {
			console.log(`It's a miss.`);
			this.misses.push(`${xAxis},${yAxis}`);
		}
		this.trackAllShips();
	}

	trackAllShips() {
		if (this.ships.every((ship) => ship.newShip.sunk)) {
			this.allShipsSunk = true;
		}
	}
}

export class player {
	constructor(name) {
		this.board = new gameBoard();
		this.name = name;
	}
}

export class gamePlay {
	constructor(name) {
		this.player1 = new player(name);
		this.computer = new player("Computer");
	}
}

class boardSquare {
	constructor(x, y) {
		this.xAxis = x;
		this.yAxis = y;
		this.left = null;
		this.right = null;
		this.up = null;
		this.down = null;
	}

	setEdges(boardLength, boardHeight, map) {
		let xMinus = `${this.xAxis - 1}`;
		let xPlus = `${this.xAxis + 1}`;
		let yMinus = `${this.yAxis - 1}`;
		let yPlus = `${this.yAxis + 1}`;
		let y = `${this.yAxis}`;
		let x = `${this.xAxis}`;

		this.left = this.xAxis == 0 ? null : map.get(`${xMinus},${y}`);
		this.right = this.xAxis == boardLength - 1 ? null : map.get(`${xPlus},${y}`);
		this.up = this.yAxis == boardHeight - 1 ? null : map.get(`${x},${yPlus}`);
		this.down = this.yAxis == 0 ? null : map.get(`${x},${yMinus}`);
	}
}

export class Ship {
	constructor(length) {
		this.length = length;
		this.timesHit = 0;
		this.sunk = false;
	}

	hit() {
		this.timesHit += 1;
		this.isSunk();
	}

	isSunk() {
		if (this.timesHit === this.length) {
			this.sunk = true;
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
		for (let x = 1; x < 11; x++) {
			for (let y = 1; y < 11; y++) {
				let square = new boardSquare(y, x);
				map.set(`${y},${x}`, square);
			}
		}
		map.forEach((square) => {
			square.setEdges(10, 10, map);
		});
		return map;
	}

	placeShip(length, square, direction, shipEl = null) {
		let newShip = new Ship(length);
		let location = [];
		let count = 0;
		let root = square;
		let q = [this.boardMap.get(`${square[0]},${square[1]}`)];
		if (direction === "vertical") {
			let curSqr;
			while (count < length) {
				curSqr = q.shift();
				location.push(`${curSqr.yAxis},${curSqr.xAxis}`);
				q.push(curSqr.up);
				count++;
			}
		}
		if (direction === "horizontal") {
			let curSqr;
			while (count < length) {
				curSqr = q.shift();
				location.push(`${curSqr.yAxis},${curSqr.xAxis}`);
				q.push(curSqr.right);
				count++;
			}
		}
		location = location.sort();
		this.ships.push({ newShip, location, root, direction, shipEl });
		return location;
	}

	receiveAttack(xAxis, yAxis) {
		let hitTrack = 0;
		for (let i = 0; i <= this.ships.length - 1; i++) {
			if (this.ships[i].location.includes(`${yAxis},${xAxis}`)) {
				this.ships[i].newShip.hit();
				hitTrack = 1;
				break;
			}
		}
		if (hitTrack === 0) {
			this.misses.push(`${yAxis},${xAxis}`);
			this.trackAllShips();
			return "miss";
		}
		this.trackAllShips();
		return "hit";
	}

	trackAllShips() {
		if (this.ships.every((ship) => ship.newShip.sunk)) {
			this.allShipsSunk = true;
		}
	}
}

export class player {
	constructor() {
		this.board = new gameBoard();
	}
}

export class gamePlay {
	constructor() {
		this.player1 = new player();
		this.computer = new player();
	}
}

class boardSquare {
	constructor(y, x) {
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

		this.left = this.xAxis == 1 ? null : map.get(`${y},${xMinus}`);
		this.right = this.xAxis == boardLength ? null : map.get(`${y},${xPlus}`);
		this.up = this.yAxis == 1 ? null : map.get(`${yMinus},${x}`);
		this.down = this.yAxis == boardHeight ? null : map.get(`${yPlus},${x}`);
	}
}

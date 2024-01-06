import * as ships from "../DOM";
import * as game from "../gameboard";
import _ from "../../../node_modules/lodash";
import { before } from "lodash";

describe("ships", () => {
	let sub = new ships.Ship(_.random(10));

	test("ship build", () => {
		expect(
			(() => {
				let startHit = sub.timesHit;
				sub.hit();
				return sub.timesHit - startHit;
			})()
		).toBe(1);
	});

	sub.timesHit = 0;

	test("isSunk", () => {
		expect(
			(() => {
				let count = 0;
				do {
					sub.hit();
					count++;
				} while (count <= sub.length);
				return sub.sunk;
			})()
		).toBe(true);
	});
});

describe("gameboard", () => {
	let board = new game.gameBoard();
	let boardKeys = board.boardMap.keys();

	beforeEach(() => {
		board.ships = [];
	});

	test("board build", () => {
		expect(boardKeys.next().value).toBe("0,0");
		expect(boardKeys.next().value).toBe("0,1");
	});

	test("place ship vert", () => {
		expect(
			(() => {
				board.placeShip(5, "2,3", "vertical");
				let loc = board.ships[0].location;
				return loc[0];
			})()
		).toBe("2,1");
	});

	test("place ship horz", () => {
		expect(
			(() => {
				board.placeShip(2, "9,5", "horizontal");
				let loc = board.ships[0].location;
				return loc[0];
			})()
		).toBe("8,5");
	});

	test("receive attack 1", () => {
		expect(
			(() => {
				board.placeShip(2, "9,5", "horizontal");
				board.receiveAttack(8, 5);
				return board.ships[0].newShip.timesHit;
			})()
		).toBe(1);
	});

	test("receive attack 2", () => {
		expect(
			(() => {
				board.placeShip(5, "2,5", "horizontal");
				board.receiveAttack(0, 5);
				board.receiveAttack(4, 5);
				return board.ships[0].newShip.timesHit;
			})()
		).toBe(2);
	});

	test("receive attack 3", () => {
		expect(
			(() => {
				board.placeShip(5, "2,5", "horizontal");
				board.receiveAttack(0, 5);
				board.receiveAttack(1, 5);
				board.receiveAttack(2, 5);
				board.receiveAttack(3, 5);
				board.receiveAttack(4, 5);
				return board.ships[0].newShip.sunk;
			})()
		).toBe(true);
	});

	test("receive attack misses", () => {
		expect(
			(() => {
				board.placeShip(5, "2,5", "horizontal");
				board.placeShip(2, "9,5", "horizontal");
				board.receiveAttack(2, 8);
				board.receiveAttack(5, 1);
				board.receiveAttack(8, 5);
				board.receiveAttack;
				return board.misses;
			})()
		).toStrictEqual(["2,8", "5,1"]);
	});

	test("all ships sunk true", () => {
		expect(
			(() => {
				board.placeShip(3, "2,5", "horizontal");
				board.placeShip(2, "9,4", "horizontal");
				board.receiveAttack(2, 5);
				board.receiveAttack(1, 5);
				board.receiveAttack(3, 5);
				board.receiveAttack(9, 4);
				board.receiveAttack(8, 4);
				return board.allShipsSunk;
			})()
		).toBe(true);
	});

	test("all ships sunk false", () => {
		expect(
			(() => {
				board.placeShip(3, "2,5", "horizontal");
				board.placeShip(2, "9,4", "horizontal");
				board.receiveAttack(2, 5);
				board.receiveAttack(0, 5);
				board.receiveAttack(3, 5);
				board.receiveAttack(9, 4);
				board.receiveAttack(8, 4);
				return board.allShipsSunk;
			})()
		).toBe(true);
	});
});

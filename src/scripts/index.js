import "../styles/reset.css";
import "../styles/style.css";
import * as gaming from "./gameboard.js";
import * as dom from "./DOM.js";

export let game;

export function startGame(reset = null) {
	game = new gaming.gamePlay();
	dom.gameMode(game, reset);
}

startGame();

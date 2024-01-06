import "../styles/reset.css";
import "../styles/style.css";
import * as gaming from "./gameboard.js";
import * as dom from "./DOM.js";

let game = new gaming.gamePlay();
dom.createGrid(dom.playerGridElement, "player");
dom.createGrid(dom.computerGridElement);
dom.getName();
dom.placeShips();

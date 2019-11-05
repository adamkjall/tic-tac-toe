"use strict";

const winningCombos = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 4, 8],
  [2, 4, 6],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8]
];

const player1 = Player("Player X", "X");
const player2 = Player("Player O", "O");
let currentPlayer;

const squareElements = document.querySelectorAll(".squares .square");
const messageElement = document.querySelector(".container .player");

const enableListeners = () =>
  squareElements.forEach(square => square.addEventListener("click", markCell));
const disableListeners = () =>
  squareElements.forEach(square =>
    square.removeEventListener("click", markCell)
  );

const resetButton = document.querySelector(".container .reset");
resetButton.addEventListener("click", startGame);

const Gameboard = (() => {
  let board = ["", "", "", "", "", "", "", "", ""];
  const getBoard = () => board;
  const setCell = (index, mark) => {
    const isValidIndex = index >= 0 && index < board.length;
    const isEmptyCell = board[index] === "";

    if (isValidIndex && isEmptyCell) {
      board[index] = mark;
      return true;
    } else {
      return false;
    }
  };
  const reset = () => (board = board.map(cell => ""));
  const hasWinner = () =>
    winningCombos.some(
      combo =>
        board[combo[0]] !== "" &&
        board[combo[0]] === board[combo[1]] &&
        board[combo[1]] === board[combo[2]]
    );
  const isDraw = () =>
    board.reduce((draw, cell) => {
      if (cell === "") draw = false;
      return draw;
    }, true);

  return { getBoard, setCell, reset, hasWinner, isDraw };
})();

function Player(name, mark) {
  let score = 0;
  const getName = () => name;
  const getScore = () => score;
  const getMark = () => mark;
  const incrementScore = () => score++;
  const resetScore = () => (score = 0);
  return { getName, getScore, getMark, incrementScore, resetScore };
}

function markCell(e) {
  const index = e.target.dataset.index;
  const cellWasEmpy = Gameboard.setCell(index, currentPlayer.getMark());
  
  if (cellWasEmpy) {
    updateGame();
  }
}

function updateGame() {
  const board = Gameboard.getBoard();

  squareElements.forEach((square, i) => {
    square.innerHTML = board[i];
  });

  if (Gameboard.hasWinner()) {
    messageElement.innerText = currentPlayer.getName() + " won the game!";
    currentPlayer.incrementScore();
    disableListeners();
  } else if (Gameboard.isDraw()) {
    messageElement.innerText = "It's a draw!";
    disableListeners();
  } else {
    currentPlayer = currentPlayer === player1 ? player2 : player1;
    messageElement.innerText = currentPlayer.getName() + "'s turn.";
  }
}

function startGame() {
  Gameboard.reset();
  currentPlayer = Math.random() < 0.5 ? player1 : player2;
  player1.resetScore();
  player2.resetScore();
  updateGame();
  enableListeners();
}

startGame();

import React from "react";

export default function Sidebar({ startGame, restartGame, openGameListModal, roundCount, score }) {
	return (
		<div className="w-full sm:w-1/4 h-1/4 sm:h-full sm:px-6 sm:mr-5 mr-0 mb-5 sm:mb-0 bg-yellow-500 overflow-auto">
			<button onClick={() => startGame()}>Start Game</button>
			<button onClick={() => openGameListModal()}>Continue Game</button>
			<button onClick={() => restartGame()}>Restart Game</button>
			<p>Round count: {roundCount}</p>
			<p>Score: {score}</p>
		</div>
	);
}

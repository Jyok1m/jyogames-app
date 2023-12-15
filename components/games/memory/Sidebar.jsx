import React from "react";

export default function Sidebar({ startGame }) {
	return (
		<div className="w-full sm:w-1/4 h-1/4 sm:h-full sm:px-6 sm:mr-5 mr-0 mb-5 sm:mb-0 bg-yellow-500">
			<button onClick={startGame}>Start Game</button>
		</div>
	);
}

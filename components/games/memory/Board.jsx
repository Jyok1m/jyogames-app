import React from "react";
import Card from "./Card";

export default function Board({ gameData, flipCard, flippedCards }) {
	const cardPool = gameData?.initialPool?.cards;

	const cardsOnBoard = cardPool?.map((card) => {
		return (
			<Card
				key={card.position}
				url={card.url}
				position={card.position}
				flipCard={() => flipCard(card)}
				isFlipped={flippedCards.some((f) => f.position === card.position)}
			/>
		);
	});

	return (
		<div className="w-full h-full overflow-auto">
			<ul role="list" className="w-full h-full grid grid-cols-3 gap-x-4 gap-y-8 sm:gap-x-6 md:grid-cols-4 xl:gap-x-8">
				{cardsOnBoard}
			</ul>
		</div>
	);
}

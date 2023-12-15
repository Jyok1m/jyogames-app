import React, { useEffect, useState } from "react";
import Card from "./Card";

export default function Board({ newGameData }) {
	const initialCardPool = newGameData?.newGame?.initialPool?.cards;

	const [flippedCards, setFlippedCards] = useState([]);

	useEffect(() => {
		setTimeout(() => {
			flipBack();
		}, 1000);
	}, [flippedCards]);

	const flipCard = (cardPosition) => {
		if (flippedCards.includes(cardPosition)) {
			setFlippedCards(flippedCards.filter((position) => position !== cardPosition));
		} else {
			setFlippedCards([...flippedCards, cardPosition]);
		}
	};

	const flipBack = () => {
		if (flippedCards.length === 2) {
			setFlippedCards([]);
		}
	};

	return (
		<div className="w-full h-full overflow-auto">
			<ul role="list" className="w-full h-full grid grid-cols-3 gap-x-4 gap-y-8 sm:gap-x-6 md:grid-cols-4 xl:gap-x-8">
				{initialCardPool?.map((card) => (
					<Card key={card.position} url={card.url} position={card.position} flipCard={flipCard} isFlipped={flippedCards.includes(card.position)} />
				))}
			</ul>
		</div>
	);
}

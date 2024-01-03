"use client";

import { useState, useEffect } from "react";
import { useSelector } from "react-redux";

import Card from "./Card";

export default function Board({
  // gameData,
  flipCard,
  flippedCards,
  foundCards,
}) {
  const { token } = useSelector((state) => state.user.value);

  const [gameData, setGameData] = useState({});

  const cardPool = gameData?.initialPool?.cards;

  const cardsOnBoard = cardPool?.map((card) => {
    const isFlipped =
      flippedCards.some((f) => f.position === card.position) ||
      foundCards.includes(card.cardId);

    return (
      <Card
        key={card.position}
        url={card.url}
        position={card.position}
        flipCard={() => (!isFlipped ? flipCard(card) : null)}
        isFlipped={isFlipped}
      />
    );
  });

  return (
    <div className="h-full w-full overflow-auto">
      <ul
        role="list"
        className="grid h-full w-full grid-cols-3 gap-x-4 gap-y-8 sm:gap-x-6 md:grid-cols-4 xl:gap-x-8"
      >
        {cardsOnBoard}
      </ul>
    </div>
  );
}

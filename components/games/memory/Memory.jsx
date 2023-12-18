"use client";

import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Board from "./Board";
import Sidebar from "./Sidebar";
import Modal from "../../popups/Modal";

export default function Memory() {
	const { uid } = useSelector((state) => state.user.value);

	// Game states
	const [gameData, setGameData] = useState({});
	const [currentGames, setCurrentGames] = useState([]);

	// Modal states
	const [openGameListModal, setOpenGameListModal] = useState(false);
	const [selectedGame, setSelectedGame] = useState({});

	// Board states
	const [flippedCards, setFlippedCards] = useState([]);
	const [foundCards, setFoundCards] = useState([]);
	const [flipCount, setFlipCount] = useState(0);
	const [roundCount, setRoundCount] = useState(0);
	const [score, setScore] = useState(0);

	/* ---------------------------------------------------------------- */
	/*                            Game start                            */
	/* ---------------------------------------------------------------- */

	useEffect(() => {
		const getCurrentGames = async () => {
			try {
				const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/memory/current-games/${uid}`);
				const data = await res.json();

				if (res.status === 200) {
					setCurrentGames(data.currentGames);
				} else {
					throw new Error(data.error);
				}
			} catch (err) {
				console.error(err);
			}
		};

		getCurrentGames();
	}, [gameData]);

	const startNewGame = async () => {
		try {
			const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/memory/new-game`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ uids: [uid] }),
			});

			const data = await res.json();

			if (res.status === 200) {
				setGameData(data.gameData);
			} else {
				throw new Error(data.error);
			}
		} catch (err) {
			console.error(err);
		}
	};

	const continueGame = async () => {
		try {
			const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/memory/continue-game/${selectedGame}`);
			const data = await res.json();

			if (res.status === 200) {
				setGameData(data.gameData);
			} else {
				throw new Error(data.error);
			}
		} catch (err) {
			console.error(err);
		} finally {
			resetStates();
		}
	};

	const restartGame = async () => {
		if (gameData) {
			try {
				const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/memory/restart-game/${gameData._id}`, {
					method: "PUT",
				});
				const data = await res.json();

				if (res.status === 200) {
					setGameData(data.gameData);
					setFlippedCards([]);
					setFoundCards([]);
					setFlipCount(0);
					setRoundCount(0);
					setScore(0);
				} else {
					throw new Error(data.error);
				}
			} catch (err) {
				console.error(err);
			}
		}
	};

	const resetStates = () => {
		setOpenGameListModal(false);
		setSelectedGame(null);
	};

	/* ---------------------------------------------------------------- */
	/*                            Game logic                            */
	/* ---------------------------------------------------------------- */

	useEffect(() => {
		if (flipCount > 0 && flipCount % 2 === 0) {
			checkMatch();
			setRoundCount(roundCount + 1);
		}
	}, [flipCount]);

	// 1. Flip a card
	const flipCard = async (card) => {
		setFlippedCards([...flippedCards, card]);
		setFlipCount(flipCount + 1);
	};

	// 3. Check if the last 2 flipped cards match
	const checkMatch = () => {
		const cardIdA = flippedCards[flippedCards.length - 1].cardId;
		const cardIdB = flippedCards[flippedCards.length - 2].cardId;

		if (cardIdA === cardIdB) {
			setFoundCards([...foundCards, cardIdA]);
			setScore(score + 1);
		} else {
			setTimeout(() => {
				flipCardsBack(cardIdA, cardIdB);
			}, 500);
		}
	};

	// 4. If the 2 flipped cards don't match, flip them back
	const flipCardsBack = (cardIdA, cardIdB) => {
		const filteredFlippedCards = flippedCards.filter((card) => ![cardIdA, cardIdB].includes(card.cardId));
		setFlippedCards(filteredFlippedCards);
	};

	/* ---------------------------------------------------------------- */
	/*                            Components                            */
	/* ---------------------------------------------------------------- */

	const currentGamesList = currentGames?.map((game) => (
		<button key={game._id} onClick={() => setSelectedGame(game._id)}>
			{game._id}
		</button>
	));

	/* ---------------------------------------------------------------- */
	/*                                JSX                               */
	/* ---------------------------------------------------------------- */

	return (
		<div className="mx-auto h-full max-w-7xl px-2 sm:px-6 lg:px-8 flex flex-col items-center justify-center bg-red-500">
			<h1 className="text-white font-bold text-lg mb-5">Memory</h1>
			<div className="w-full h-4/5 p-5 flex flex-col sm:flex-row sm:justify-between sm:items-center bg-blue-500">
				<Sidebar
					startGame={() => startNewGame()}
					restartGame={() => restartGame()}
					openGameListModal={() => setOpenGameListModal(true)}
					roundCount={roundCount}
					score={score}
				/>
				<Board gameData={gameData} flipCard={(card) => flipCard(card)} flippedCards={flippedCards} />
			</div>
			<Modal
				title="Parties en cours"
				content={currentGamesList}
				selectedContent={selectedGame}
				visible={openGameListModal}
				onClose={() => resetStates()}
				onValidate={() => continueGame()}
			/>
		</div>
	);
}

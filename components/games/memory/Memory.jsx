"use client";

import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Board from "./Board";
import Sidebar from "./Sidebar";

export default function Memory() {
	const { uid } = useSelector((state) => state.user.value);

	const [gameData, setGameData] = useState(null);
	const [currentGames, setCurrentGames] = useState(null);

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

	const continueGame = async (gameId) => {
		try {
			const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/memory/continue-game/${gameId}`);
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

	return (
		<div className="mx-auto h-full max-w-7xl px-2 sm:px-6 lg:px-8 flex flex-col items-center justify-center bg-red-500">
			<h1 className="text-white font-bold text-lg mb-5">Memory</h1>
			<div className="w-full h-4/5 p-5 flex flex-col sm:flex-row sm:justify-between sm:items-center bg-blue-500">
				<Sidebar startGame={() => startNewGame()} continueGame={continueGame} currentGames={currentGames} />
				<Board gameData={gameData} />
			</div>
		</div>
	);
}

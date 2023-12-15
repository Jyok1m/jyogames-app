"use client";

import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Board from "./Board";
import Sidebar from "./Sidebar";

export default function Memory() {
	const { uid } = useSelector((state) => state.user.value);

	console.log("uid", uid);

	const [newGameData, setNewGameData] = useState(null);

	const fetchInitialCards = async () => {
		try {
			const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/memory/new-game`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ uids: [uid] }),
			});

			const data = await res.json();

			switch (res.status) {
				case 200:
					setNewGameData(data);
					break;
				case 400:
					break;
				case 500:
					break;
				default:
					break;
			}
		} catch (err) {
			console.error(err);
		}
	};

	return (
		<div className="mx-auto h-full max-w-7xl px-2 sm:px-6 lg:px-8 flex flex-col items-center justify-center bg-red-500">
			<h1 className="text-white font-bold text-lg mb-5">Memory</h1>
			<div className="w-full h-4/5 p-5 flex flex-col sm:flex-row sm:justify-between sm:items-center bg-blue-500">
				<Sidebar startGame={() => fetchInitialCards()} newGameData={newGameData} />
				<Board newGameData={newGameData} />
			</div>
		</div>
	);
}

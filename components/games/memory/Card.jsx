import React from "react";

export default function Card({ url, position, flipCard, isFlipped }) {
	return (
		<li key={position} className="relative">
			<div className="group aspect-w-1 aspect-h-1 block w-full overflow-hidden rounded-lg bg-gray-100 focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2 focus-within:ring-offset-gray-100">
				<img
					src={url}
					alt=""
					className={!isFlipped ? "hidden cursor-pointer group-hover:opacity-75" : "object-cover"}
					onClick={() => flipCard(position)}
				/>
				<div className={isFlipped ? "hidden" : "cursor-pointer object-cover bg-black group-hover:opacity-75"} onClick={() => flipCard(position)} />
			</div>
		</li>
	);
}

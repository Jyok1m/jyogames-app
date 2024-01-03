import { getToken } from "@/helpers/cookieHandler";

export default async function SavesList({ currentGames }) {
  return (
    <div>
      <h1 className="mb-5 text-center text-4xl font-bold text-white">Resume Game</h1>
      <div className="overflow-scroll text-left text-white">
        <div className="my-5">
          <h3 className="text-center text-2xl font-bold text-white mb-2.5">Objective</h3>
          <p className="mb-1">The objective of the Memory Game is to find all pairs of matching cards.</p>
        </div>
        <div className="mb-1">
          <h3 className="text-center text-2xl font-bold text-white mb-2.5">Gameplay</h3>
          <ol>
            <li className="mb-1">Flip two cards.</li>
            <li className="mb-1">If the cards match, you score 100 points and go again.</li>
            <li className="mb-1">If the cards do not match, you lose 25 points.</li>
            <li className="mb-1">The unmatched cards are turned back over.</li>
            <li className="mb-1">The game continues until all pairs are found.</li>
          </ol>
        </div>
        <div className="my-5">
          <h3 className="text-center text-2xl font-bold text-white mb-2.5">Winning condition</h3>
          <p>The player with the highest score at the end of the game wins.</p>
        </div>
      </div>
    </div>
  );
}

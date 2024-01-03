import { getTranslations } from "next-intl/server";
import GameCard from "@/components/GameCard";

export default async function GameDisplay({ gameList }) {
  const t = await getTranslations("home");

  const gameCard = gameList?.map((game) => {
    const { _id } = game;
    return <GameCard key={_id} game={game} gameId={_id} />;
  });

  return (
    <div className="w-8/12 rounded-t-3xl border-t-2 border-t-blue-600 bg-gradient-to-b from-gray-900">
      <div className="mx-auto max-w-2xl overflow-hidden px-4 py-10 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-extrabold text-white w-full border-b-2 border-b-gray-600 mb-5">
          {t("newGames")}
        </h2>
        <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 lg:gap-x-8">
          {gameCard}
        </div>
      </div>
    </div>
  );
}

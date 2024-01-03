export default function GameCard({ game, gameId }) {
  const url = `/games/${gameId}`;
  return (
    <a href={url} className="text-sm group">
      <div className="relative h-64 w-48 rounded-3xl bg-gray-100 image-container hover:opacity-90">
        <img
          src="/memory-image.png"
          alt={""}
          className="h-full w-full rounded-3xl object-cover object-center"
        />
        <div className="absolute bottom-0 w-full rounded-b-3xl title-container blue-gradient">
          <h3 className="text-center font-extrabold text-white">
            {game.title}
          </h3>
        </div>
      </div>
    </a>
  );
}

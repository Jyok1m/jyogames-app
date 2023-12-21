import GameDisplay from "@/app/components/home/GameDisplay";

export default async function Home() {
  const gameList = await fetchGames();
  console.log("gameList", gameList);

  return (
    <main
      className="w-screen min-h-full overflow-hidden pt-16 flex flex-col items-center justify-between bg-cover bg-blue-950, bg-center"
      style={{ backgroundImage: "url('/background-image.png')" }}
    >
      <h1 className="text-4xl font-bold text-center">Jyogames</h1>
      <GameDisplay gameList={gameList} />
    </main>
  );
}

export async function fetchGames() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/library`);
    const data = await res.json();

    if (res.status !== 200) {
      throw new Error(data.message);
    }

    return data.games;
  } catch (err) {
    console.log(err);
  }
}

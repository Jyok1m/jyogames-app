import { getTranslations } from "next-intl/server";
import GameDisplay from "@/app/components/home/GameDisplay";

export default async function Home() {
  const gameList = await fetchGames();
  const t = await getTranslations("home");

  return (
    <main
      className="h-full w-screen overflow-auto bg-cover bg-center pt-64 bg-blue-950"
      style={{ backgroundImage: "url('/background-image.png')" }}
    >
      <div className="flex flex-col items-center justify-end">
        <div className="z-10 -mb-1 flex flex-col items-center justify-center rounded-t-3xl border-none bg-gradient-to-t from-gray-900 px-20 pt-20">
          <h1 className="text-6xl font-bold text-white sm:text-8xl">
            Jyogames
          </h1>
          <div className="my-5 flex w-full flex-row items-center justify-evenly">
            <a
              type="button"
              className="btn-orange-gradient text-center"
              href="/auth"
            >
              {t("signIn")}
            </a>
            <a type="button" className="btn-blue-gradient text-center" href="/">
              {t("nextReleases")}
            </a>
          </div>
        </div>
        <GameDisplay gameList={gameList} />
      </div>
    </main>
  );
}

export async function fetchGames() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/library`, {
      cache: "no-store",
    });
    const data = await res.json();
    const { games, message } = data;

    if (res.status !== 200) {
      throw new Error(message);
    }

    return games;
  } catch (err) {
    console.log(err);
  }
}

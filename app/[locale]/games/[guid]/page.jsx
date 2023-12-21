"use client";

import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { useSelectedLayoutSegment } from "next/navigation";

import Memory from "@/components/games/memory/Memory";

export default function Index() {
  const { uid } = useSelector((state) => state.user.value);
  const guid = useSelectedLayoutSegment();
  const router = useRouter();

  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    (async () => {
      const isGameValid = await checkGame();

      if (!uid || !isGameValid) {
        router.replace("/");
      } else {
        setIsAuthenticated(true);
      }
    })();
  }, [uid]);

  const checkGame = async () => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/library/load-game/${guid}`,
      );

      return res.status === 200;
    } catch (err) {
      return false;
    }
  };

  if (!isAuthenticated) return null;
  return (
    <div className="h-full w-full">
      <Memory />
    </div>
  );
}

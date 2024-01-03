"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname, useParams } from "next/navigation";

const publicPaths = ["/", "/auth"];

export default function AuthProvider({ children }) {
  const path = usePathname();
  const router = useRouter();
  const params = useParams();
  const isGame = !!params.gameId;

  const [accessGranted, setAccessGranted] = useState(false);

  useEffect(() => {
    (async () => {
      const isPublicPath = publicPaths.includes(path);
      if (isPublicPath) return setAccessGranted(true);

      const isAuthenticated = await authUser();
      if (!isAuthenticated) {
        router.replace("/auth");
      } else if (isGame) {
        const isGameValid = await verifyGame(params.gameId);
        if (!isGameValid) router.replace("/");
      } else {
        setAccessGranted(true);
      }
    })();
  }, [path]);

  const authUser = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/user/auth`, {
        method: "GET",
        credentials: "include",
      });
      return res.status === 200;
    } catch (err) {
      console.error(err);
      return false;
    }
  };

  const verifyGame = async (gameId) => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/library/verify-game/${gameId}`);
      return res.status === 200;
    } catch (err) {
      console.error(err);
      return false;
    }
  };

  if (accessGranted) {
    return <div>{children}</div>;
  }
}

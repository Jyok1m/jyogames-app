import { cookies } from "next/headers";

export function getToken() {
  const cookieStore = cookies();
  return cookieStore.get("refresh-token")?.value || null;
}

export function getGameId() {
  const cookieStore = cookies();
  return cookieStore.get("gameId")?.value || null;
}

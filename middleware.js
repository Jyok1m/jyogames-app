import { middlewareChain } from "@/middlewares/middlewareChainHandler";
import { intlMiddleware } from "@/middlewares/intlMiddleware";

export default middlewareChain([intlMiddleware]);

export const config = {
	matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};

import createMiddleware from "next-intl/middleware";

export const intlMiddleware = createMiddleware({
	locales: ["en", "fr"],
	defaultLocale: "fr",
	localePrefix: "never",
});

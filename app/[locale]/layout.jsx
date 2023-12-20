import "../globals.css";
import { notFound } from "next/navigation";
import pick from "lodash/pick";
import { NextIntlClientProvider, useMessages } from "next-intl";
import StoreProvider from "../StoreProvider";

import Header from "@/components/global/Header";

// Can be imported from a shared config
const locales = ["en", "fr"];

export const metadata = {
	title: "Jyogames",
	description: "Une nouvelle façon de jouer",
};

export default function LocaleLayout({ children, params: { locale } }) {
	const messages = useMessages();

	if (!locales.includes(locale)) notFound();

	return (
		<html lang={locale} className="h-full antialiased" suppressHydrationWarning>
			<body>
				<StoreProvider>
					<NextIntlClientProvider messages={pick(messages, "header")}>
						<Header />
					</NextIntlClientProvider>
					<main className="w-screen h-screen pt-16">{children}</main>
				</StoreProvider>
			</body>
		</html>
	);
}

import { Inter } from "next/font/google";
import "../globals.css";
import { notFound } from "next/navigation";
import Header from "../../components/global/Header";

const inter = Inter({ subsets: ["latin"] });

// Can be imported from a shared config
const locales = ["en", "fr"];

export const metadata = {
	title: "Jyogames",
	description: "Une nouvelle façon de jouer",
};

export default function LocaleLayout({ children, params: { locale } }) {
	// Validate that the incoming `locale` parameter is valid
	if (!locales.includes(locale)) notFound();

	return (
		<html lang={locale} className="h-full antialiased" suppressHydrationWarning>
			<body>
				<Header />
				<main className="w-screen h-screen pt-16">{children}</main>
			</body>
		</html>
	);
}

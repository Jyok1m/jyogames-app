import "../globals.css";
import { notFound } from "next/navigation";
import { NextIntlClientProvider, useMessages } from "next-intl";
import pick from "lodash/pick";

import StoreProvider from "@/app/StoreProvider";
import SocketProvider from "@/app/SocketProvider";
import AuthProvider from "@/app/AuthProvider";
import Header from "@/components/Header";

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
          <SocketProvider>
            <AuthProvider>
              <NextIntlClientProvider messages={pick(messages, "header")}>
                <Header />
              </NextIntlClientProvider>
              <main className="w-screen h-screen pt-16">{children}</main>
            </AuthProvider>
          </SocketProvider>
        </StoreProvider>
      </body>
    </html>
  );
}

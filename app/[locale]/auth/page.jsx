import pick from "lodash/pick";
import { NextIntlClientProvider, useTranslations, useMessages } from "next-intl";

import SignIn from "@/components/forms/SignIn";

export default function Authentication() {
	const t = useTranslations("auth");
	const messages = useMessages();

	return (
		<div className="flex min-h-full flex-1">
			<NextIntlClientProvider messages={pick(messages, "auth")}>
				<SignIn />
			</NextIntlClientProvider>
			<div className="relative hidden w-0 flex-1 lg:block">
				<img className="absolute inset-0 h-full w-full object-cover" src="/login-image.png" alt="" />
			</div>
		</div>
	);
}

import pick from "lodash/pick";
import { NextIntlClientProvider, useMessages } from "next-intl";

import AuthForm from "@/components/forms/AuthForm";

export default function Authentication() {
	const messages = useMessages();

	return (
		<div className="flex min-h-full flex-1">
			<NextIntlClientProvider messages={pick(messages, "auth")}>
				<AuthForm />
			</NextIntlClientProvider>
			<div className="relative hidden w-0 flex-1 lg:block">
				<img className="absolute inset-0 h-full w-full object-cover" src="/login-image.png" alt="" />
			</div>
		</div>
	);
}

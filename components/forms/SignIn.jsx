"use client";

import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

export default function SignIn() {
	const t = useTranslations("auth");
	const router = useRouter();

	/* ---------------------------------------------------------------- */
	/*                          Form validation                         */
	/* ---------------------------------------------------------------- */

	const validationSchema = yup.object({
		email: yup
			.string()
			.required(t("fieldRequired"))
			.matches(new RegExp(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g), t("emailNotValid")),
		password: yup
			.string()
			.required(t("fieldRequired"))
			.matches(new RegExp(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/), t("passwordNotValid")),
	});

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm({ resolver: yupResolver(validationSchema) });

	/* ---------------------------------------------------------------- */
	/*                             Functions                            */
	/* ---------------------------------------------------------------- */

	const onSubmit = async (data) => {
		const { email, password, rememberMe } = data;

		const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/sign-in`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ email, password }),
		});

		const json = await res.json();

		const { status } = res;

		if (status === 200) {
			if (data.rememberMe) {
				localStorage.setItem("uid", json.uid);
			}
			router.push("/");
		} else {
			alert(`Error ${status} : ${json.error}`);
		}
	};

	return (
		<div className="flex flex-1 flex-col justify-center px-4 py-12 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
			<div className="mx-auto w-full max-w-sm lg:w-96">
				<div>
					<h2 className="text-2xl font-bold leading-9 tracking-tight text-gray-900">{t("signIn")}</h2>
					<p className="mt-2 text-sm leading-6 text-gray-500">
						{t("notAMember")}{" "}
						<a href="#" className="font-semibold text-indigo-700 hover:text-indigo-500">
							{t("startFreeTrial")}
						</a>
					</p>
				</div>

				<div className="mt-10">
					<div>
						<form onSubmit={handleSubmit(onSubmit)} method="POST" className="space-y-6">
							<div>
								<label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
									{t("emailAddress")}
								</label>
								<div className="mt-2">
									<input
										id="email"
										name="email"
										type="email"
										autoComplete="email"
										{...register("email")}
										aria-invalid={errors.email ? "true" : "false"}
										className="block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-700 sm:text-sm sm:leading-6"
									/>
									{errors.email && <p className="mt-2 text-sm leading-6 text-gray-500">{errors.email?.message}</p>}
								</div>
							</div>

							<div>
								<label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">
									{t("password")}
								</label>
								<div className="mt-2">
									<input
										id="password"
										name="password"
										type="password"
										autoComplete="current-password"
										{...register("password")}
										aria-invalid={errors.password ? "true" : "false"}
										className="block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-700 sm:text-sm sm:leading-6"
									/>
									{errors.password && <p className="mt-2 text-sm leading-6 text-gray-500">{errors.password?.message}</p>}
								</div>
							</div>

							<div className="flex items-center justify-between">
								<div className="flex items-center">
									<input
										id="remember-me"
										name="remember-me"
										type="checkbox"
										{...register("rememberMe")}
										className="h-4 w-4 rounded border-gray-300 text-indigo-700 focus:ring-indigo-700"
									/>
									<label htmlFor="remember-me" className="ml-3 block text-sm leading-6 text-gray-700">
										{t("rememberMe")}
									</label>
								</div>

								<div className="text-sm leading-6">
									<a href="#" className="font-semibold text-indigo-700 hover:text-indigo-500">
										{t("forgotPassword")}
									</a>
								</div>
							</div>

							<div>
								<button
									type="submit"
									className="flex w-full justify-center rounded-md bg-indigo-700 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-700"
								>
									{t("signInButton")}
								</button>
							</div>
						</form>
					</div>
				</div>
			</div>
		</div>
	);
}

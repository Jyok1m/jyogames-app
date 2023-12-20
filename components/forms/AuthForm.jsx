"use client";

import { useState } from "react";
import { useDispatch } from "react-redux";
import { connectUser } from "@/lib/reducers/user";
import { useRouter, usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { LoadingOutlined } from "@ant-design/icons";
import { Spin } from "antd";
import * as yup from "yup";
import Notification from "@/components/popups/Notification";

export default function AuthForm() {
	const t = useTranslations("auth");
	const router = useRouter();
	const pathname = usePathname();
	const dispatch = useDispatch();

	const [formType, setFormType] = useState("signIn");
	const [loading, setLoading] = useState(false);
	const [success, setSuccess] = useState(false);
	const [successMessage, setSuccessMessage] = useState(null);
	const [notificationVisible, setNotificationVisible] = useState(false);
	const [errorCode, setErrorCode] = useState(null);
	const [errorMessage, setErrorMessage] = useState(null);

	/* ---------------------------------------------------------------- */
	/*                          Form validation                         */
	/* ---------------------------------------------------------------- */

	const signInSchema = yup.object({
		emailOrUsername: yup.string().required(t("fieldRequired")),
		password: yup.string().required(t("fieldRequired")),
	});

	const signUpSchema = yup.object({
		username: yup.string().required(t("fieldRequired")),
		email: yup
			.string()
			.required(t("fieldRequired"))
			.matches(new RegExp(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g), t("emailNotValid")),
		password: yup
			.string()
			.required(t("fieldRequired"))
			.matches(new RegExp(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/), t("passwordNotValid")),
	});

	const forgotSchema = yup.object({
		email: yup.string().required(t("fieldRequired")),
	});

	const {
		register,
		handleSubmit,
		formState: { errors },
		reset,
		resetField,
	} = useForm({ resolver: yupResolver(formType === "signIn" ? signInSchema : formType === "signUp" ? signUpSchema : forgotSchema) });

	/* ---------------------------------------------------------------- */
	/*                             Functions                            */
	/* ---------------------------------------------------------------- */

	const redirectToForm = (type) => {
		setFormType(type);
		reset();
	};

	const onSubmit = async (data) => {
		setLoading(true);

		switch (formType) {
			case "signIn":
				try {
					const { emailOrUsername, password } = data;

					const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/sign-in`, {
						method: "POST",
						headers: {
							"Content-Type": "application/json",
						},
						body: JSON.stringify({ emailOrUsername, password }),
					});

					const json = await res.json();

					const { status } = res;

					switch (status) {
						case 200:
							setLoading(false);
							reset();
							dispatch(connectUser(json.uid));
							router.push("/");
							break;
						case 401:
							setLoading(false);
							setErrorCode(status);
							setErrorMessage(t("invalidPassword"));
							setNotificationVisible(true);
							resetField("password");
							break;
						case 404:
							setLoading(false);
							setErrorCode(status);
							setErrorMessage(t("userNotFound"));
							setNotificationVisible(true);
							break;
						default:
							setLoading(false);
							setErrorCode(status);
							setErrorMessage(t("serverError"));
							setNotificationVisible(true);
							break;
					}
				} catch (error) {
					console.log(error);
					setLoading(false);
					setErrorMessage(t("unknownError"));
					setNotificationVisible(true);
				}
				break;
			case "signUp":
				try {
					const { username, email, password, passwordConfirmation } = data;

					if (password !== passwordConfirmation) {
						setLoading(false);
						setErrorCode(400);
						setErrorMessage(t("passwordsDontMatch"));
						setNotificationVisible(true);
						resetField("password");
						resetField("passwordConfirmation");
						return;
					}

					const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/sign-up`, {
						method: "POST",
						headers: {
							"Content-Type": "application/json",
						},
						body: JSON.stringify({ username, email, password }),
					});

					const json = await res.json();

					const { status } = res;

					switch (status) {
						case 201:
							setLoading(false);
							setSuccess(true);
							setSuccessMessage(t("accountCreated"));
							setNotificationVisible(true);
							redirectToForm("signIn");
							break;
						case 409:
							setLoading(false);
							setErrorCode(status);
							if (json.field === "username") {
								setErrorMessage(t("existingUsername"));
							} else {
								setErrorMessage(t("existingEmail"));
							}
							setNotificationVisible(true);
							break;
						default:
							setLoading(false);
							setErrorCode(status);
							setErrorMessage(t("serverError"));
							setNotificationVisible(true);
							break;
					}
				} catch (error) {
					setLoading(false);
					console.log(error);
					setErrorMessage(t("unknownError"));
					setNotificationVisible(true);
				}
				break;
			case "forgotPassword":
				try {
					const { email } = data;
					const language = pathname.slice(1, 3) === "en" ? "en" : "fr";

					const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/forgot-password/${language}`, {
						method: "POST",
						headers: {
							"Content-Type": "application/json",
						},
						body: JSON.stringify({ email }),
					});

					const { status } = res;

					switch (status) {
						case 200:
							setLoading(false);
							setSuccess(true);
							setSuccessMessage(t("resetEmailSent"));
							setNotificationVisible(true);
							redirectToForm("signIn");
							break;
						case 404:
							setLoading(false);
							setErrorCode(status);
							setErrorMessage(t("userNotFound"));
							setNotificationVisible(true);
							break;
						default:
							setLoading(false);
							setErrorCode(status);
							setErrorMessage(t("serverError"));
							setNotificationVisible(true);
							break;
					}
				} catch (error) {
					setLoading(false);
					console.log(error);
					setErrorMessage(t("unknownError"));
					setNotificationVisible(true);
				}
				break;
			default:
				break;
		}
	};

	const closeNotification = () => {
		setNotificationVisible(false);
		setTimeout(() => {
			setSuccess(false);
			setSuccessMessage(null);
			setErrorCode(null);
			setErrorMessage(null);
		}, 300);
	};

	/* ---------------------------------------------------------------- */
	/*                            Form types                            */
	/* ---------------------------------------------------------------- */

	const signInForm = (
		<div className="mx-auto w-full max-w-sm lg:w-96">
			<div>
				<h2 className="text-2xl font-bold leading-9 tracking-tight text-gray-900">{t("signIn")}</h2>
				<p className="mt-2 text-sm leading-6 text-gray-500">
					{t("notAMember")}{" "}
					<a className="font-semibold text-indigo-700 hover:text-indigo-500 cursor-pointer" onClick={() => !loading && redirectToForm("signUp")}>
						{t("createAccount")}
					</a>
				</p>
			</div>

			<div className="mt-10">
				<div>
					<form onSubmit={handleSubmit(onSubmit)} method="POST" className="space-y-6">
						<div>
							<label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
								{t("emailOrUsername")}
							</label>
							<div className="mt-2">
								<input
									id="emailOrUsername"
									name="emailOrUsername"
									autoComplete="email"
									disabled={loading}
									{...register("emailOrUsername")}
									aria-invalid={errors.emailOrUsername ? "true" : "false"}
									className="block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-700 sm:text-sm sm:leading-6"
								/>
								{errors.emailOrUsername && <p className="mt-2 text-sm leading-6 text-gray-500">{errors.emailOrUsername?.message}</p>}
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
									disabled={loading}
									{...register("password")}
									aria-invalid={errors.password ? "true" : "false"}
									className="block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-700 sm:text-sm sm:leading-6"
								/>
								{errors.password && <p className="mt-2 text-sm leading-6 text-gray-500">{errors.password?.message}</p>}
							</div>
						</div>

						<div className="flex items-center justify-between">
							<div className="text-sm leading-6">
								<a
									className="font-semibold text-indigo-700 hover:text-indigo-500 cursor-pointer"
									onClick={() => !loading && redirectToForm("forgotPassword")}
								>
									{t("forgotPassword")}
								</a>
							</div>
						</div>

						<div>
							<button
								type="submit"
								disabled={loading}
								className="flex w-full justify-center items-center rounded-md bg-indigo-700 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-700"
							>
								{loading && (
									<Spin
										indicator={
											<LoadingOutlined
												style={{
													fontSize: 18,
													color: "white",
													marginRight: 5,
												}}
												spin
											/>
										}
									/>
								)}
								{t("signInButton")}
							</button>
						</div>
					</form>
				</div>
			</div>
		</div>
	);

	const signUpForm = (
		<div className="mx-auto w-full max-w-sm lg:w-96">
			<div>
				<a
					className="mb-3 font-semibold text-indigo-700 hover:text-indigo-500 cursor-pointer flex items-center"
					onClick={() => !loading && redirectToForm("signIn")}
				>
					<ArrowLeftIcon className="h-5 w-5 mr-1" />
					{t("goBack")}
				</a>
				<h2 className="text-2xl font-bold leading-9 tracking-tight text-gray-900">{t("signUp")}</h2>
			</div>

			<div className="mt-10">
				<div>
					<form onSubmit={handleSubmit(onSubmit)} method="POST" className="space-y-6">
						<div>
							<label htmlFor="username" className="block text-sm font-medium leading-6 text-gray-900">
								{t("username")}
							</label>
							<div className="mt-2">
								<input
									id="username"
									name="username"
									type="text"
									disabled={loading}
									{...register("username")}
									aria-invalid={errors.username ? "true" : "false"}
									className="block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-700 sm:text-sm sm:leading-6"
								/>
								{errors.username && <p className="mt-2 text-sm leading-6 text-gray-500">{errors.username?.message}</p>}
							</div>
						</div>

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
									disabled={loading}
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
									disabled={loading}
									{...register("password")}
									aria-invalid={errors.password ? "true" : "false"}
									className="block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-700 sm:text-sm sm:leading-6"
								/>
								{errors.password && <p className="mt-2 text-sm leading-6 text-gray-500">{errors.password?.message}</p>}
							</div>
						</div>

						<div>
							<label htmlFor="passwordConfirmation" className="block text-sm font-medium leading-6 text-gray-900">
								{t("passwordConfirmation")}
							</label>
							<div className="mt-2">
								<input
									id="passwordConfirmation"
									name="passwordConfirmation"
									type="password"
									autoComplete="current-password"
									disabled={loading}
									{...register("passwordConfirmation")}
									aria-invalid={errors.passwordConfirmation ? "true" : "false"}
									className="block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-700 sm:text-sm sm:leading-6"
								/>
								{errors.passwordConfirmation && <p className="mt-2 text-sm leading-6 text-gray-500">{errors.passwordConfirmation?.message}</p>}
							</div>
						</div>

						<div>
							<button
								type="submit"
								disabled={loading}
								className="flex mt-12 w-full justify-center items-center rounded-md bg-indigo-700 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-700"
							>
								{loading && (
									<Spin
										indicator={
											<LoadingOutlined
												style={{
													fontSize: 18,
													color: "white",
													marginRight: 5,
												}}
												spin
											/>
										}
									/>
								)}
								{t("signUpButton")}
							</button>
						</div>
					</form>
				</div>
			</div>
		</div>
	);

	const forgotPasswordForm = (
		<div className="mx-auto w-full max-w-sm lg:w-96">
			<div>
				<a
					className="mb-3 font-semibold text-indigo-700 hover:text-indigo-500 cursor-pointer flex items-center"
					onClick={() => !loading && redirectToForm("signIn")}
				>
					<ArrowLeftIcon className="h-5 w-5 mr-1" />
					{t("goBack")}
				</a>
				<h2 className="text-2xl font-bold leading-9 tracking-tight text-gray-900">{t("forgotPassword")}</h2>

				<p className="mt-2 text-sm leading-6 text-gray-500">{t("forgotInstructions")}</p>
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
									disabled={loading}
									{...register("email")}
									aria-invalid={errors.email ? "true" : "false"}
									className="block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-700 sm:text-sm sm:leading-6"
								/>
								{errors.email && <p className="mt-2 text-sm leading-6 text-gray-500">{errors.email?.message}</p>}
							</div>
						</div>

						<div>
							<button
								type="submit"
								disabled={loading}
								className="flex w-full justify-center items-center rounded-md bg-indigo-700 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-700"
							>
								{loading && (
									<Spin
										indicator={
											<LoadingOutlined
												style={{
													fontSize: 18,
													color: "white",
													marginRight: 5,
												}}
												spin
											/>
										}
									/>
								)}
								{t("forgotButton")}
							</button>
						</div>
					</form>
				</div>
			</div>
		</div>
	);

	/* ---------------------------------------------------------------- */
	/*                                JSX                               */
	/* ---------------------------------------------------------------- */

	return (
		<div className="flex flex-1 flex-col justify-center px-4 py-12 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
			{formType === "signIn" && signInForm}
			{formType === "signUp" && signUpForm}
			{formType === "forgotPassword" && forgotPasswordForm}
			<Notification
				visible={notificationVisible}
				hide={() => closeNotification()}
				success={success}
				title={success ? t("success") : `${t("error")} ${errorCode}`}
				content={success ? successMessage : errorMessage}
			/>
		</div>
	);
}

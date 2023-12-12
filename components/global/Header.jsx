"use client";

import { Fragment, useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import socketIOClient from "socket.io-client";
import { Disclosure, Menu, Transition } from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { useSelector, useDispatch } from "react-redux";
import { disconnectUser } from "@/lib/reducers/user";

function classNames(...classes) {
	return classes.filter(Boolean).join(" ");
}

export default function Header() {
	const t = useTranslations("header");
	const router = useRouter();
	const dispatch = useDispatch();
	const { uid } = useSelector((state) => state.user.value);

	const [socket, setSocket] = useState(null);

	// Handle socket connection with backend
	useEffect(() => {
		const socket = socketIOClient(process.env.NEXT_PUBLIC_BACKEND_URL); // Création du socket et lien avec le serveur
		setSocket(socket); // Stockage du socket dans le state

		// Connection du socket au serveur
		socket.on("connect", () => {
			if (uid) {
				socket.emit("connectUser", { uid }, (response) => {
					console.log(response);
				});
			}
		});

		return () => {
			socket.off("connect"); // Débranche l'écoute du socket "connect"
			socket.disconnect(); // Déconnecte le socket du serveur
		};
	}, [uid]);

	const handleDisconnection = async () => {
		const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/sign-out`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ uid }),
		});

		const { status } = res;

		if (status === 200) {
			dispatch(disconnectUser());
			router.push("/");
		} else {
			const json = await res.json();
			alert(`Error ${status} : ${json.error}`);
		}
	};

	return (
		<Disclosure as="nav" className="bg-blue-950 shadow absolute w-full">
			{({ open }) => (
				<>
					<div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
						<div className="relative flex h-16 justify-between">
							<div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
								{/* Mobile menu button */}
								<Disclosure.Button className="relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500">
									<span className="absolute -inset-0.5" />
									<span className="sr-only">Open main menu</span>
									{open ? <XMarkIcon className="block h-6 w-6" aria-hidden="true" /> : <Bars3Icon className="block h-6 w-6" aria-hidden="true" />}
								</Disclosure.Button>
							</div>
							<div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
								<div className="flex flex-shrink-0 items-center cursor-pointer" onClick={() => router.push("/")}>
									<img className=" h-20 w-auto" src="/logo.png" alt="Logo Jyogames" />
								</div>
								<div className="hidden sm:ml-6 sm:flex sm:space-x-8">
									{/* Current: "border-indigo-500 text-gray-900", Default: "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700" */}
									<a
										href="/"
										className="inline-flex items-center border-b-2 border-indigo-500 px-1 pt-1 text-sm font-medium text-white hover:border-indigo-500 hover:text-indigo-500"
									>
										Accueil
									</a>
									{/* <a
										href="/"
										className="inline-flex items-center border-b-2 border-transparent px-1 pt-1 text-sm font-medium text-white hover:border-indigo-500 hover:text-indigo-500"
									>
										Jeux
									</a>
									<a
										href="/"
										className="inline-flex items-center border-b-2 border-transparent px-1 pt-1 text-sm font-medium text-white hover:border-indigo-500 hover:text-indigo-500"
									>
										Statistiques
									</a>
									<a
										href="/"
										className="inline-flex items-center border-b-2 border-transparent px-1 pt-1 text-sm font-medium text-white hover:border-indigo-500 hover:text-indigo-500"
									>
										À venir
									</a> */}
								</div>
							</div>
							<div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
								{/* Profile dropdown */}

								{uid && (
									<Menu as="div" className="relative ml-3">
										<div>
											<Menu.Button className="relative flex rounded-full bg-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
												<span className="absolute -inset-1.5" />
												<span className="sr-only">Open user menu</span>
												<img
													className="h-8 w-8 rounded-full"
													src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
													alt=""
												/>
											</Menu.Button>
										</div>
										<Transition
											as={Fragment}
											enter="transition ease-out duration-200"
											enterFrom="transform opacity-0 scale-95"
											enterTo="transform opacity-100 scale-100"
											leave="transition ease-in duration-75"
											leaveFrom="transform opacity-100 scale-100"
											leaveTo="transform opacity-0 scale-95"
										>
											<Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
												{/* <Menu.Item>
													{({ active }) => (
														<a href="#" className={classNames(active ? "bg-gray-100" : "", "block px-4 py-2 text-sm text-gray-700")}>
															Mon compte
														</a>
													)}
												</Menu.Item>
												<Menu.Item>
													{({ active }) => (
														<a href="#" className={classNames(active ? "bg-gray-100" : "", "block px-4 py-2 text-sm text-gray-700")}>
															Paramètres
														</a>
													)}
												</Menu.Item> */}
												<Menu.Item>
													{({ active }) => (
														<a
															onClick={handleDisconnection}
															className={classNames(active ? "bg-gray-100" : "", "block px-4 py-2 text-sm text-gray-700 cursor-pointer")}
														>
															Déconnexion
														</a>
													)}
												</Menu.Item>
											</Menu.Items>
										</Transition>
									</Menu>
								)}
								{!uid && (
									<button
										type="button"
										className="rounded-md bg-indigo-700 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
										onClick={() => router.push("/auth")}
									>
										{t("signIn")}
									</button>
								)}
							</div>
						</div>
					</div>

					<Disclosure.Panel className="sm:hidden">
						<div className="space-y-1 pb-4 pt-2">
							{/* Current: "bg-indigo-50 border-indigo-500 text-indigo-700", Default: "border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700" */}
							<Disclosure.Button
								as="a"
								href="/"
								className="block border-l-4 border-indigo-500 bg-indigo-50 py-2 pl-3 pr-4 text-base font-medium text-indigo-700"
							>
								Accueil
							</Disclosure.Button>
							{/* <Disclosure.Button
								as="a"
								href="/"
								className="block border-l-4 border-transparent py-2 pl-3 pr-4 text-base font-medium text-gray-500 hover:border-gray-300 hover:bg-gray-50 hover:text-gray-700"
							>
								Jeux
							</Disclosure.Button>
							<Disclosure.Button
								as="a"
								href="/"
								className="block border-l-4 border-transparent py-2 pl-3 pr-4 text-base font-medium text-gray-500 hover:border-gray-300 hover:bg-gray-50 hover:text-gray-700"
							>
								Statistiques
							</Disclosure.Button>
							<Disclosure.Button
								as="a"
								href="/"
								className="block border-l-4 border-transparent py-2 pl-3 pr-4 text-base font-medium text-gray-500 hover:border-gray-300 hover:bg-gray-50 hover:text-gray-700"
							>
								À venir
							</Disclosure.Button> */}
						</div>
					</Disclosure.Panel>
				</>
			)}
		</Disclosure>
	);
}

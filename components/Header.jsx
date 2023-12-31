"use client";

import { Fragment, useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { useRouter, usePathname, useParams, useSelectedLayoutSegment } from "next/navigation";
import { Disclosure, Menu, Transition } from "@headlessui/react";
import { Bars3Icon, XMarkIcon, GlobeAltIcon, UserCircleIcon } from "@heroicons/react/24/outline";
import { useDispatch } from "react-redux";
import { changeLocale } from "@/lib/reducers/user";
import { useSocket } from "@/app/SocketProvider";
import Cookies from "js-cookie";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function Header() {
  const t = useTranslations("header");
  const router = useRouter();
  const dispatch = useDispatch();
  const socket = useSocket();
  const isConnected = !!Cookies.get("connected");

  /* ---------------------------------------------------------------- */
  /*                               URLS                               */
  /* ---------------------------------------------------------------- */
  const pathname = usePathname();
  const params = useParams();
  const slugSegment = useSelectedLayoutSegment() || "";

  /* ---------------------------------------------------------------- */
  /*                            State hooks                           */
  /* ---------------------------------------------------------------- */

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    window.addEventListener("resize", () => {
      setIsMobile(window.innerWidth < 640);
    });

    return () => {
      window.removeEventListener("resize", () => {
        setIsMobile(window.innerWidth < 640);
      });
    };
  }, []);

  useEffect(() => {
    setIsMobile(window.innerWidth < 640);
    dispatch(changeLocale(params.locale));
  }, [pathname]);

  const handleDisconnection = async () => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/user/sign-out`, {
      method: "GET",
      credentials: "include",
    });

    const { status } = res;

    if (status === 200) {
      socket.emit("offline", (res) => {
        console.log(res);
      });
      router.push("/");
    } else {
      const json = await res.json();
      alert(`Error ${status} : ${json.error}`);
    }
  };

  return (
    <Disclosure as="nav" className="absolute w-full shadow bg-gradient-to-b from-blue-950 to-blue-900">
      {({ open }) => (
        <>
          <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
            <div className="relative flex h-16 justify-between">
              <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                {/* Mobile menu button */}
                <Disclosure.Button className="relative inline-flex items-center justify-center rounded-md p-2 text-white">
                  <span className="absolute -inset-0.5" />
                  <span className="sr-only">Open main menu</span>
                  {open ? (
                    <XMarkIcon className="h-8 w-8 cursor-pointer font-medium text-white hover:text-indigo-500" aria-hidden="true" />
                  ) : (
                    <Bars3Icon className="h-8 w-8 cursor-pointer font-medium text-white hover:text-indigo-500" aria-hidden="true" />
                  )}
                </Disclosure.Button>
              </div>
              <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
                <div className="flex flex-shrink-0 cursor-pointer items-center" onClick={() => router.push("/")}>
                  <img className="h-20 w-auto" src="/logo.png" alt="Logo Jyogames" />
                </div>
                <div className="hidden sm:space-x-8 sm:ml-6 sm:flex">
                  {/* Current: "border-indigo-500 text-gray-900", Default: "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700" */}
                  <a
                    href="/"
                    className="inline-flex items-center border-b-2 border-indigo-500 px-1 pt-1 text-sm font-medium text-white hover:border-indigo-500 hover:text-indigo-500"
                  >
                    {t("home")}
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
                <Menu as="div" className="relative ml-3">
                  <div>
                    <Menu.Button className="rounded-md px-2 py-2 text-sm font-semibold text-white shadow-sm">
                      <GlobeAltIcon className="h-8 w-8 cursor-pointer font-medium text-white hover:text-indigo-500" aria-hidden="true" />
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
                      <Menu.Item>
                        {({ active }) => (
                          <a
                            onClick={() => router.push(`/fr/${slugSegment}`)}
                            className={classNames(active ? "bg-gray-100" : "", "block px-4 py-2 text-sm text-gray-700 cursor-pointer")}
                          >
                            Français
                          </a>
                        )}
                      </Menu.Item>
                      <Menu.Item>
                        {({ active }) => (
                          <a
                            onClick={() => router.push(`/en/${slugSegment}`)}
                            className={classNames(active ? "bg-gray-100" : "", "block px-4 py-2 text-sm text-gray-700 cursor-pointer")}
                          >
                            English
                          </a>
                        )}
                      </Menu.Item>
                    </Menu.Items>
                  </Transition>
                </Menu>

                {/* Profile dropdown */}

                {isConnected && (
                  <Menu as="div" className="relative ml-3">
                    <div>
                      <Menu.Button className="relative flex rounded-full bg-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
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
                              {t("signOut")}
                            </a>
                          )}
                        </Menu.Item>
                      </Menu.Items>
                    </Transition>
                  </Menu>
                )}

                {!isConnected && isMobile && (
                  <button
                    type="button"
                    className="h-8 w-8 cursor-pointer font-medium text-white hover:text-indigo-500"
                    onClick={() => router.push("/auth")}
                  >
                    <UserCircleIcon className="h-8 w-8 cursor-pointer font-medium text-white" />
                  </button>
                )}

                {!isConnected && !isMobile && (
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
            <div className="pt-2 pb-4 space-y-1">
              {/* Current: "bg-indigo-50 border-indigo-500 text-indigo-700", Default: "border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700" */}
              <Disclosure.Button
                as="a"
                href="/"
                className="block border-l-4 border-indigo-500 bg-indigo-50 py-2 pr-4 pl-3 text-base font-medium text-indigo-700"
              >
                Accueil
              </Disclosure.Button>
              {/* <Disclosure.Button
								as="a"
								href="/"
								className="block border-l-4 border-transparent py-2 pr-4 pl-3 text-base font-medium text-gray-500 hover:border-gray-300 hover:bg-gray-50 hover:text-gray-700"
							>
								Jeux
							</Disclosure.Button>
							<Disclosure.Button
								as="a"
								href="/"
								className="block border-l-4 border-transparent py-2 pr-4 pl-3 text-base font-medium text-gray-500 hover:border-gray-300 hover:bg-gray-50 hover:text-gray-700"
							>
								Statistiques
							</Disclosure.Button>
							<Disclosure.Button
								as="a"
								href="/"
								className="block border-l-4 border-transparent py-2 pr-4 pl-3 text-base font-medium text-gray-500 hover:border-gray-300 hover:bg-gray-50 hover:text-gray-700"
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

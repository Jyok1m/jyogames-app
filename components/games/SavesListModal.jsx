"use client";

import { Fragment, useRef, useState, useEffect } from "react";
import { useSocket } from "@/app/SocketProvider";
import { useParams } from "next/navigation";
import { useSelector } from "react-redux";
import { Dialog, Transition } from "@headlessui/react";

export default function SavesListModal({ children }) {
  const socket = useSocket();
  const { gameId } = useParams();
  const { token } = useSelector((state) => state.user.value);

  const [open, setOpen] = useState(false);
  const initialFocusRef = useRef(null);

  useEffect(() => {
    socket.on("saveListModalOpen", () => {
      setOpen(true);
    });

    return () => {
      socket.off("saveListModalOpen");
    };
  }, []);

  // Sends information to the server to resume a certain game
  function resumeGame() {
    socket.emit("resumeGame", { gameId, tokens: [token] }, (res) => {
      // Modal closes if the game is successfully resumed
      setOpen(!res.success);
    });
  }

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-10"
        initialFocus={initialFocusRef}
        onClose={() => null}
      >
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-opacity-75 transition-opacity bg-blue-950" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 w-screen overflow-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative flex w-11/12 transform flex-col items-center overflow-hidden rounded-3xl border-t-2 border-t-blue-600 bg-gradient-to-b to-gray-900 p-5 from-blue-950 sm:w-9/12 lg:w-1/2">
                <div ref={initialFocusRef} tabIndex={-1} />
                {children}
                <div className="my-5 flex w-full flex-col items-center justify-evenly sm:w-3/4 sm:flex-row">
                  <button
                    type="button"
                    className="mb-4 w-3/4 text-center btn-orange-gradient sm:mb-0 sm:w-5/12"
                    onClick={() => setOpen(false)}
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    className="mb-4 w-3/4 text-center btn-blue-gradient sm:mb-0 sm:ml-4 sm:w-5/12"
                    onClick={() => resumeGame()}
                  >
                    Resume
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}

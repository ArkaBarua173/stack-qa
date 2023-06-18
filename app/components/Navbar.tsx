"use client";

import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Avatar from "react-avatar";

export default function Navbar() {
  const [dropdown, setDropdown] = useState(false);
  const router = useRouter();
  const { data: session, status, update } = useSession();
  // Polling the session every 1 hour
  useEffect(() => {
    // TIP: You can also use `navigator.onLine` and some extra event handlers
    // to check if the user is online and only update the session if they are.
    // https://developer.mozilla.org/en-US/docs/Web/API/Navigator/onLine
    const interval = setInterval(() => update(), 1000 * 60 * 60);
    return () => clearInterval(interval);
  }, [update]);

  // Listen for when the page is visible, if the user switches tabs
  // and makes our tab visible again, re-fetch the session
  useEffect(() => {
    const visibilityHandler = () =>
      document.visibilityState === "visible" && update();
    window.addEventListener("visibilitychange", visibilityHandler, false);
    return () =>
      window.removeEventListener("visibilitychange", visibilityHandler, false);
  }, [update]);

  return (
    <nav className="bg-slate-200 py-4 sticky top-0 z-50 h-20">
      <div className="w-11/12 mx-auto grid grid-cols-3 place-content-center items-center">
        <div>
          <Link href={"/"} className="text-2xl italic font-bold text-blue-700">
            Stack-QA
          </Link>
        </div>
        <div className="relative">
          <input
            type="search"
            className="w-full border border-gray-300 rounded-3xl shadow-sm pl-10"
          />
          <Image
            src={"/search.svg"}
            alt={"search icon"}
            width={20}
            height={20}
            className="absolute top-2.5 left-3"
          />
        </div>
        <div className="justify-self-end">
          {status === "unauthenticated" ? (
            <div className="flex gap-3">
              <button
                onClick={() => router.push("/auth/login")}
                className="font-medium rounded-lg shadow-sm h-11 py-2 px-4 border-2 border-blue-600 bg-white hover:shadow-inner"
              >
                Login
              </button>
              <button
                onClick={() => router.push("/auth/register")}
                className="font-medium rounded-lg shadow-sm  h-11 py-2 px-4 bg-blue-600 text-white"
              >
                Signup
              </button>
            </div>
          ) : (
            <div className="flex gap-4 justify-center items-center">
              <div>
                <h1 className="tracking-wide text-lg font-bold text-gray-800">
                  Welcome, {session?.user?.name}
                </h1>
                <h2 className="text-sm tracking-tight font-medium text-gray-700">
                  {session?.user?.email}
                </h2>
              </div>
              <div
                className="cursor-pointer relative"
                onClick={() => setDropdown((prev) => !prev)}
              >
                {session?.user?.image ? (
                  <Image
                    src={session?.user?.image}
                    alt="Profile picture"
                    width={45}
                    height={45}
                    className="rounded-full shadow-md"
                  />
                ) : (
                  <Avatar
                    name={session?.user?.name as string}
                    size="45"
                    round={true}
                  />
                )}
                {dropdown && (
                  <div className="absolute top-20 right-0 w-56 shadow">
                    <ul className=" bg-white shadow-lg rounded-lg py-2">
                      <li className="px-5 py-2 hover:bg-gray-100 ">
                        <Link
                          href={"/profile"}
                          className="flex gap-4 items-center"
                        >
                          <Image
                            src={"/profile.svg"}
                            alt="Profile"
                            width={18}
                            height={18}
                          />
                          <div>Profile</div>
                        </Link>
                      </li>
                      <li className="px-5 py-2 hover:bg-gray-100">
                        <div
                          onClick={() => signOut()}
                          className="flex gap-4 items-center"
                        >
                          <Image
                            src={"/signout.svg"}
                            alt="sign out"
                            width={18}
                            height={18}
                          />
                          <div>Sign out</div>
                        </div>
                      </li>
                    </ul>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

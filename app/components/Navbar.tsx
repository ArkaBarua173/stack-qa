"use client";

import { signOut, useSession } from "next-auth/react";
import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Search from "./Search";
const Avatar = dynamic(() => import("react-avatar"), { ssr: false });

export default function Navbar() {
  const [dropdown, setDropdown] = useState(false);
  const router = useRouter();
  const { data: session, status } = useSession();

  return (
    <nav className="bg-slate-200 py-4 sticky top-0 z-20 h-20">
      <div className="w-11/12 mx-auto grid grid-cols-3 place-content-center items-center">
        <div>
          <Link href={"/"} className="text-2xl italic font-bold text-blue-700">
            Stack-QA
          </Link>
        </div>
        <Search />
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
                          onClick={() => {
                            signOut();
                          }}
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

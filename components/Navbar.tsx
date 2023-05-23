"use client";

import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";

export default function Navbar() {
  const { data: session } = useSession();
  return (
    <nav className="bg-slate-200 py-4 sticky top-0 z-50">
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
          <div className="flex gap-4 justify-center items-center">
            <div>
              <h1 className="tracking-wide text-xl">
                Welcome,{" "}
                <span className="font-semibold"> {session?.user?.name}</span>
              </h1>
              <h2 className="text-sm tracking-tight">{session?.user?.email}</h2>
            </div>
            <Image
              src={session?.user?.image ? session?.user?.image : "/user.svg"}
              alt="Profile picture"
              width={50}
              height={50}
              className="rounded-full shadow-md"
            />
          </div>
        </div>
      </div>
    </nav>
  );
}

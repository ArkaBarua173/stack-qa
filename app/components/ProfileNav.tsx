"use client";

import { signOut } from "next-auth/react";
import Link from "next/link";
import { CgProfile } from "react-icons/cg";
import { IoSettingsOutline } from "react-icons/io5";
import { RiQuestionAnswerLine } from "react-icons/ri";
import { VscSignOut } from "react-icons/vsc";
import { usePathname } from "next/navigation";

export default function ProfileNav() {
  const path = usePathname();

  return (
    <ul className="flex flex-col">
      <Link
        href={"/profile"}
        className={`transition items-center ease-in-out flex gap-5 font-medium  ${
          path === "/profile"
            ? "bg-slate-200 border-l-4 border-l-gray-600"
            : "hover:text-white hover:bg-slate-400 hover:border-l-4 hover:border-l-gray-600 active:bg-slate-200 active:border-l-4 active:border-l-gray-600"
        } py-4 px-8 border-b-2 border-slate-300`}
      >
        <CgProfile size={18} />
        Profile
      </Link>
      <Link
        href={"/profile/settings"}
        className={`transition items-center ease-in-out flex gap-5 font-medium  ${
          path === "/profile/settings"
            ? "bg-slate-200 border-l-4 border-l-gray-600"
            : "hover:text-white hover:bg-slate-400 hover:border-l-4 hover:border-l-gray-600 active:bg-slate-200 active:border-l-4 active:border-l-gray-600"
        } py-4 px-8 border-b-2 border-slate-300`}
      >
        <IoSettingsOutline size={18} />
        Settings
      </Link>
      <Link
        href={"/profile/q-and-a"}
        className={`transition items-center ease-in-out flex gap-5 font-medium  ${
          path === "/profile/q-and-a"
            ? "bg-slate-200 border-l-4 border-l-gray-600"
            : "hover:text-white hover:bg-slate-400 hover:border-l-4 hover:border-l-gray-600 active:bg-slate-200 active:border-l-4 active:border-l-gray-600"
        } py-4 px-8 border-b-2 border-slate-300`}
      >
        <RiQuestionAnswerLine size={18} /> Q & A
      </Link>
      <button
        onClick={() => signOut()}
        className={`transition items-center ease-in-out flex gap-5 font-medium hover:text-white hover:bg-slate-400 hover:border-l-4 hover:border-l-gray-600 active:bg-slate-200 active:border-l-4 active:border-l-gray-600 py-4 px-8 border-b-2 border-slate-300`}
      >
        <VscSignOut size={18} />
        Signout
      </button>
    </ul>
  );
}

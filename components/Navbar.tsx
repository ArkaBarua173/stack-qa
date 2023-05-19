"use client";

import { signOut, useSession } from "next-auth/react";

export default function Navbar() {
  const { data: session, status } = useSession();
  return (
    <div>
      {JSON.stringify(session)}
      <br />
      {status}
      <br />
      <br />
      <button className="border border-gray-300 p-4" onClick={() => signOut()}>
        Logout
      </button>
    </div>
  );
}

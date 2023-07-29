import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import QAndAContent from "@/app/components/QAndAContent";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import React from "react";

export default async function QAndA() {
  const session = await getServerSession(authOptions);

  if (!session) redirect("/auth/login");

  return (
    <div className="p-8">
      <QAndAContent />
    </div>
  );
}

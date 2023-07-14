import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth";
import dynamic from "next/dynamic";
import { redirect } from "next/navigation";
const SettingsContent = dynamic(
  () => import("@/app/components/SettingsContent"),
  { ssr: false }
);

export default async function Settings() {
  const session = await getServerSession(authOptions);

  if (!session) redirect("/auth/login");
  return (
    <div className="p-8">
      <h1 className="font-medium text-2xl">Settings</h1>
      <SettingsContent />
    </div>
  );
}

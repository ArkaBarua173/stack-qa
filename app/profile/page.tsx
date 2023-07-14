import { getServerSession } from "next-auth";
import dynamic from "next/dynamic";
import { redirect } from "next/navigation";
import { authOptions } from "../api/auth/[...nextauth]/route";
const ProfileContent = dynamic(() => import("@/app/components/ProfileContent"));

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);

  if (!session) redirect("/auth/login");

  return (
    <div>
      <ProfileContent />
    </div>
  );
}

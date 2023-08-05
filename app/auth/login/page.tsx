import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth";
import dynamic from "next/dynamic";
import { redirect } from "next/navigation";
const LoginForm = dynamic(() => import("@/app/components/LoginForm"), {
  ssr: false,
});

export const metadata = {
  title: "Stack-QA | login",
  description: "created by Arka Barua",
};

export default async function Login() {
  const session = await getServerSession(authOptions);

  if (session) redirect("/");
  return (
    <div className="flex flex-col justify-start items-center min-h-screen text-gray-700">
      <div className="text-center font-bold pb-3">
        <h1 className="text-3xl italic mt-8 text-blue-700">Stack-QA</h1>
        <h3 className="text-xl">Login</h3>
      </div>
      <LoginForm />
    </div>
  );
}

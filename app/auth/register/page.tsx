import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import RegisterForm from "@/app/components/RegisterForm";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Stack-QA | Register",
  description: "created by Arka Barua",
};

export default async function Register() {
  const session = await getServerSession(authOptions);

  if (session) redirect("/");
  return (
    <div className="flex flex-col justify-start items-center min-h-screen text-gray-700">
      <div className="text-center font-bold pb-3">
        <h1 className="text-3xl italic mt-8 text-blue-700">Stack-QA</h1>
        <h3 className="text-xl">Register</h3>
      </div>
      <RegisterForm />
    </div>
  );
}

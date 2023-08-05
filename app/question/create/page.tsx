import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import QuestionForm from "@/app/components/QuestionForm";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default async function create() {
  const session = await getServerSession(authOptions);

  if (!session) redirect("/auth/login");

  return (
    <div className="flex flex-col justify-start items-center min-h-screen text-gray-700">
      <h1 className="text-2xl font-bold py-12">Ask a Question</h1>
      <QuestionForm />
    </div>
  );
}

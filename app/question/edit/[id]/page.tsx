import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import EditQuestionForm from "@/app/components/EditQuestionForm";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

type Props = {
  params: {
    id: string;
  };
};

export default async function EditQuestion({ params: { id } }: Props) {
  const session = await getServerSession(authOptions);

  if (!session) redirect("/auth/login");
  return (
    <div className="flex flex-col justify-start items-center min-h-screen text-gray-700">
      <h1 className="text-2xl font-bold py-12">Edit Question</h1>
      <EditQuestionForm questionId={id} />
    </div>
  );
}

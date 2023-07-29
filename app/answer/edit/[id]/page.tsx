import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import EditAnswerForm from "@/app/components/EditAnswerForm";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

type Props = {
  params: {
    id: string;
  };
};

export default async function EditAnswer({ params: { id } }: Props) {
  const session = await getServerSession(authOptions);

  if (!session) redirect("/auth/login");
  return (
    <div className="flex flex-col justify-start items-center text-gray-700">
      <h1 className="text-2xl font-bold py-12">Edit Answer</h1>
      <EditAnswerForm answerId={id} />
    </div>
  );
}

import QuestionForm from "@/components/QuestionForm";

export default function create() {
  return (
    <div className="flex flex-col justify-start items-center min-h-screen text-gray-700">
      <h1 className="text-2xl font-bold py-12">Ask a Question</h1>
      <QuestionForm />
    </div>
  );
}

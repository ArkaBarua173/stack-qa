import SingleQuestion from "@/components/SingleQuestion";
import getAllQuestions from "@/lib/getAllQuestions";

type Props = {
  params: {
    id: string;
  };
};

// export async function generateStaticParams() {
//   const questions = await getAllQuestions();

//   return questions.map((question) => ({
//     id: question.id,
//   }));
// }

export default function QuestionPage({ params: { id } }: Props) {
  return (
    <div>
      <SingleQuestion id={id} />
    </div>
  );
}

import TagQuestionList from "@/components/TagQuestionList";
import getAllQuestions from "@/lib/getAllQuestions";

type Props = {
  params: {
    tag: string;
  };
};

export async function generateStaticParams() {
  const questions = await getAllQuestions();

  return questions.map((question) => ({
    id: question.id,
  }));
}

export default function TagPage({ params: { tag } }: Props) {
  return (
    <div>
      <TagQuestionList tagName={tag} />
    </div>
  );
}

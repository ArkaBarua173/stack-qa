import { QuestionType } from "@/types";

export default async function getAllQuestions(): Promise<QuestionType[]> {
  const res = await fetch(`http://localhost:3000/api/question/getQuestionList`);
  const data = await res.json();
  return data.data;
}

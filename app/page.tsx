import QuestionList from "@/app/components/QuestionList";
import getQueryClient from "./utils/getQueryClient";
import { QuestionType } from "@/types";
import { dehydrate } from "@tanstack/query-core";
import Hydrate from "./utils/HydrateClient";

const getQuestionList = async (): Promise<QuestionType[]> => {
  const res = await fetch(`http://localhost:3000/api/question/getQuestionList`);
  return res.json();
};

export default async function Home() {
  const queryClient = getQueryClient();
  await queryClient.prefetchQuery(["QuestionList"], () => getQuestionList());
  const dehydratedState = dehydrate(queryClient);

  return (
    <main>
      <Hydrate state={dehydratedState}>
        <QuestionList />
      </Hydrate>
    </main>
  );
}

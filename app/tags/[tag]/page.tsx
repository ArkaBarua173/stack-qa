import Hydrate from "@/app/utils/HydrateClient";
import getQueryClient from "@/app/utils/getQueryClient";
import { QuestionType } from "@/types";
import { dehydrate } from "@tanstack/query-core";
import dynamic from "next/dynamic";

const TagQuestionList = dynamic(
  () => import("@/app/components/TagQuestionList")
);

type Props = {
  params: {
    tag: string;
  };
};

const getQuestionList = async (tag: string): Promise<QuestionType[]> => {
  const res = await fetch(`http://localhost:3000/api/tag/${tag}`);
  return res.json();
};

export default async function TagPage({ params: { tag } }: Props) {
  const queryClient = getQueryClient();
  await queryClient.prefetchQuery(["TagQuestionList", tag], () =>
    getQuestionList(tag)
  );
  const dehydratedState = dehydrate(queryClient);

  return (
    <div>
      <Hydrate state={dehydratedState}>
        <TagQuestionList tag={tag} />
      </Hydrate>
    </div>
  );
}

import TagQuestionList from "@/app/components/TagQuestionList";
import Hydrate from "@/app/utils/HydrateClient";
import getQueryClient from "@/app/utils/getQueryClient";
import { QuestionType } from "@/types";
import { dehydrate } from "@tanstack/query-core";

type Props = {
  params: {
    tag: string;
  };
};

type TagQuestionListType = {
  data: QuestionType[];
};

const getTagQuestionList = async (
  tag: string
): Promise<TagQuestionListType> => {
  const res = await fetch(`http://localhost:3000/api/tag/${tag}`);
  return res.json();
};

export default async function TagPage({ params: { tag } }: Props) {
  const queryClient = getQueryClient();
  await queryClient.prefetchQuery(["QuestionList", tag], () =>
    getTagQuestionList(tag)
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

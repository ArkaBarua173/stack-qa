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

export default async function TagPage({ params: { tag } }: Props) {
  return (
    <div>
      <TagQuestionList tag={tag} />
    </div>
  );
}

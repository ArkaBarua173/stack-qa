"use client";

import { QuestionType } from "@/types";
import QuestionItem from "./QuestionItem";
import { useQuery } from "@tanstack/react-query";

type Props = {
  tag: string;
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

export default function TagQuestionList({ tag }: Props) {
  const { data: TagQuestionList } = useQuery<TagQuestionListType>({
    queryKey: ["TagQuestionList", tag],
    queryFn: () => getTagQuestionList(tag),
  });

  console.log(TagQuestionList);

  return (
    <div>
      {TagQuestionList && (
        <div className="w-full max-w-6xl my-4 mx-auto">
          <h1 className="font-semibold">
            {TagQuestionList?.data?.length} Questions found by tag &quot;
            {tag}
            &quot;
          </h1>
          {TagQuestionList?.data?.map((question) => (
            <QuestionItem key={question?.id} question={question} />
          ))}
        </div>
      )}
    </div>
  );
}

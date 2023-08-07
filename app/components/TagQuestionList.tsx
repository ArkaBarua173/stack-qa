"use client";

import { QuestionType } from "@/types";
import dynamic from "next/dynamic";
const QuestionItem = dynamic(() => import("./QuestionItem"), { ssr: false });
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
const Loading = dynamic(() => import("@/app/components/Loading"), {
  ssr: false,
});

type Props = {
  tag: string;
};

type TagQuestionListType = {
  data: QuestionType[];
};

const getTagQuestionList = async (
  tag: string
): Promise<TagQuestionListType> => {
  const res = await axios.get(`/api/tag/${tag}`);
  return res.data;
};

export default function TagQuestionList({ tag }: Props) {
  const { data: TagQuestionList, isLoading } = useQuery<TagQuestionListType>({
    queryKey: ["TagQuestionList", tag],
    queryFn: () => getTagQuestionList(tag),
  });

  return (
    <div>
      {isLoading && (
        <div className="flex justify-center items-center my-4">
          <Loading />
        </div>
      )}
      <div className="w-full max-w-6xl my-4 mx-auto">
        {!isLoading && (
          <h1 className="font-semibold">
            {TagQuestionList?.data?.length} Questions found by tag &quot;
            {tag}
            &quot;
          </h1>
        )}
        {TagQuestionList?.data?.map((question) => (
          <QuestionItem key={question?.id} question={question} />
        ))}
      </div>
    </div>
  );
}

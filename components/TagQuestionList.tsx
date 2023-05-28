"use client";

import { QuestionType } from "@/types";
import QuestionItem from "./QuestionItem";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";

const getTagQuestionList = async (tag: string): Promise<QuestionType[]> => {
  const res = await axios.get(`/api/tag/${tag}`);
  return res.data.data;
};

type Props = {
  tagName: string;
};

export default function TagQuestionList({ tagName }: Props) {
  const { data: TagQuestionList } = useQuery({
    queryKey: ["TagQuestionList", tagName],
    queryFn: () => getTagQuestionList(tagName),
  });

  return (
    <div>
      {TagQuestionList && (
        <div className="w-full max-w-6xl my-4 mx-auto">
          <h1 className="font-semibold">
            {TagQuestionList.length} Questions found by tag {tagName}
          </h1>
          {TagQuestionList?.map((question) => (
            <QuestionItem key={question?.id} question={question} />
          ))}
        </div>
      )}
    </div>
  );
}

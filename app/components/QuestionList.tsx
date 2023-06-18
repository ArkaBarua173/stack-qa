"use client";

import { QuestionType } from "@/types";
import QuestionItem from "./QuestionItem";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";

const getQuestionList = async () => {
  const res = await axios.get(`/api/question/getQuestionList`);
  return res.data;
};

type QuestionListType = {
  data: QuestionType[];
};

export default function QuestionList() {
  const { data, isLoading } = useQuery<QuestionListType>({
    queryKey: ["QuestionList"],
    queryFn: getQuestionList,
  });

  return (
    <div>
      <div>
        {isLoading && <div>Loading...</div>}
        {data?.data.map((question) => (
          <QuestionItem key={question?.id} question={question} />
        ))}
      </div>
    </div>
  );
}

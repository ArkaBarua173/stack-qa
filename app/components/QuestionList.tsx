"use client";

import { QuestionType } from "@/types";
const QuestionItem = dynamic(() => import("./QuestionItem"), { ssr: false });
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import dynamic from "next/dynamic";

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

"use client";

import { QuestionType } from "@/types";
import QuestionItem from "./QuestionItem";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";

const getQuestionList = async (): Promise<QuestionType[]> => {
  const res = await axios.get(`/api/question/getQuestionList`);
  return res.data.data;
};

export default function QuestionList() {
  const { data: questionList } = useQuery({
    queryKey: ["QuestionList"],
    queryFn: getQuestionList,
  });

  return (
    <div>
      {questionList && (
        <div>
          {questionList?.map((question) => (
            <QuestionItem key={question?.id} question={question} />
          ))}
        </div>
      )}
    </div>
  );
}

"use client";

import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import "highlight.js/styles/github-dark.css";
import { QuestionType } from "@/types";
import QuestionItem from "./QuestionItem";

const getQuestionList = async (): Promise<QuestionType[]> => {
  const res = await axios.get("/api/question/getQuestionList");
  return res.data.data;
};

export default function QuestionList() {
  const { data: questionList } = useQuery({
    queryKey: ["getQuestionList"],
    queryFn: getQuestionList,
  });

  console.log(questionList);

  return (
    <div>
      {questionList && (
        <div className="">
          {questionList?.map((question) => (
            <QuestionItem key={question?.id} question={question} />
          ))}
        </div>
      )}
    </div>
  );
}

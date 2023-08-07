"use client";

import { QuestionType } from "@/types";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import ProfileQandAItem from "./ProfileQandAItem";
import dynamic from "next/dynamic";
const Loading = dynamic(() => import("@/app/components/Loading"), {
  ssr: false,
});

const getQuestionsBySessionUser = async () => {
  const res = await axios.get(`/api/profile/getQuestionBySessionUser`);
  return res.data;
};

const getAnswersBySessionUser = async () => {
  const res = await axios.get(`/api/profile/getAnswersBySessionUser`);
  return res.data;
};

type QuestionListType = {
  data: QuestionType[];
};
type AnswersOfQuestionListType = {
  data: {
    question: QuestionType;
  }[];
};

export default function QAndAContent() {
  const { data: questions, isLoading: questionsLoading } =
    useQuery<QuestionListType>({
      queryKey: ["QuestionsBySessionUser"],
      queryFn: getQuestionsBySessionUser,
    });
  const { data: answers, isLoading: answersLoading } =
    useQuery<AnswersOfQuestionListType>({
      queryKey: ["AnswersBySessionUser"],
      queryFn: getAnswersBySessionUser,
    });

  return (
    <div className="w-full">
      <div>
        <h1 className="font-medium text-2xl mb-2">Questions</h1>
        {questionsLoading && (
          <div className="my-2">
            <Loading />
          </div>
        )}
        {questions?.data?.map((question) => (
          <ProfileQandAItem key={question?.id} question={question} />
        ))}
      </div>
      <div>
        <h1 className="font-medium text-2xl mb-2">Answers</h1>
        {answersLoading && (
          <div className="my-2">
            <Loading />
          </div>
        )}
        {answers?.data?.map((question) => (
          <ProfileQandAItem
            key={question?.question?.id}
            question={question?.question}
          />
        ))}
      </div>
    </div>
  );
}

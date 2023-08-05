"use client";

import { QuestionType } from "@/types";
const QuestionItem = dynamic(() => import("./QuestionItem"), { ssr: false });
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import dynamic from "next/dynamic";
import { useSession } from "next-auth/react";

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

  const { status } = useSession();

  const handleClick = () => {
    if (status === "authenticated") {
      window.location.href = "/question/create";
    } else {
      window.location.href = "/auth/login";
    }
  };

  return (
    <div>
      <div>
        {isLoading && <div>Loading...</div>}
        {data?.data?.length === 0 && (
          <div className="text-center font-semibold">
            No Questions at the moment
          </div>
        )}
        <div className="text-center mt-3">
          <button
            className="bg-blue-600 px-3 py-2 rounded text-white font-semibold"
            onClick={handleClick}
          >
            Ask a Question
          </button>
        </div>
        {data?.data.map((question) => (
          <QuestionItem key={question?.id} question={question} />
        ))}
      </div>
    </div>
  );
}

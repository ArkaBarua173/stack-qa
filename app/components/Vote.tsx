"use client";

import axios from "axios";
import UpvoteSvg from "./svg/Upvote-svg";
import { QuestionType } from "@/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import UpvotefillSvg from "./svg/Upvotefill-svg";

type Props = {
  questionId: string;
};

const getQuestionVotes = async (
  questionId: string
): Promise<QuestionType[]> => {
  const res = await axios.get(`/api/vote/questionVotes/${questionId}`);
  return res.data.data;
};

export default function Vote({ questionId }: Props) {
  const { data: session } = useSession();
  const queryClient = useQueryClient();
  const { data: QuestionVotes, isLoading: isDataLoading } = useQuery({
    queryKey: ["QuestionVotes", questionId],
    queryFn: () => getQuestionVotes(questionId),
  });

  const { mutate, isLoading } = useMutation(
    async (data: { questionId: string }) =>
      await axios.post(`/api/vote/questionVotes`, data),
    {
      onError: (error) => {
        console.log(error);
      },
      onSuccess: (data) => {
        queryClient.invalidateQueries(["QuestionVotes"]);
      },
    }
  );

  return (
    <div className="flex items-center gap-2">
      {QuestionVotes?.some(
        (vote) => vote.user.email === session?.user?.email
      ) ? (
        <button
          disabled={isLoading}
          className=" inline-block"
          onClick={() => mutate({ questionId })}
        >
          <UpvotefillSvg fill={isLoading ? "#374151" : "#1d4ed8"} size="20" />
        </button>
      ) : (
        <button
          disabled={isLoading}
          className=" inline-block"
          onClick={() => mutate({ questionId })}
        >
          <UpvoteSvg fill={isLoading ? "#374151" : "#1d4ed8"} size="20" />
        </button>
      )}
      <div className="font-semibold">
        {isDataLoading && <p className="text-xs">loading...</p>}
        {QuestionVotes?.length}{" "}
        <span className="text-gray-500">
          {QuestionVotes && QuestionVotes?.length === 1 ? "vote" : "votes"}
        </span>
      </div>
    </div>
  );
}

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
  const { data: QuestionVotes } = useQuery({
    queryKey: ["QuestionVotes", questionId],
    queryFn: () => getQuestionVotes(questionId),
  });

  const { mutate } = useMutation(
    async (data: { questionId: string }) =>
      await axios.post(`/api/vote/questionVotes`, data),
    {
      onError: (error) => {
        console.log(error);
      },
      onSuccess: (data) => {
        console.log(data);
        queryClient.invalidateQueries(["QuestionVotes"]);
      },
    }
  );

  return (
    <div className="flex items-center gap-2">
      {QuestionVotes?.some(
        (vote) => vote.user.email === session?.user?.email
      ) ? (
        <div
          className="cursor-pointer inline-block"
          onClick={() => mutate({ questionId })}
        >
          <UpvotefillSvg fill="#374151" size="20" />
        </div>
      ) : (
        <div
          className="cursor-pointer inline-block"
          onClick={() => mutate({ questionId })}
        >
          <UpvoteSvg fill="#374151" size="20" />
        </div>
      )}
      <div className="font-semibold">
        {QuestionVotes?.length}{" "}
        <span className="text-gray-500">
          {QuestionVotes && QuestionVotes?.length === 1 ? "vote" : "votes"}
        </span>
      </div>
    </div>
  );
}

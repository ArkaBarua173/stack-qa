"use client";

import axios from "axios";
import UpvoteSvg from "./svg/Upvote-svg";
import { QuestionType } from "@/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import UpvotefillSvg from "./svg/Upvotefill-svg";

type Props = {
  answerId: string;
};

const getAnswerVotes = async (answerId: string): Promise<QuestionType[]> => {
  const res = await axios.get(`/api/vote/answerVotes/${answerId}`);
  return res.data.data;
};

export default function Vote({ answerId }: Props) {
  const { data: session, status } = useSession();
  const queryClient = useQueryClient();
  const { data: AnswerVotes } = useQuery({
    queryKey: ["AnswerVotes", answerId],
    queryFn: () => getAnswerVotes(answerId),
  });

  const { mutate } = useMutation(
    async (data: { answerId: string }) =>
      await axios.post(`/api/vote/answerVotes`, data),
    {
      onError: (error) => {
        console.log(error);
      },
      onSuccess: (data) => {
        console.log(data);
        queryClient.invalidateQueries(["AnswerVotes"]);
      },
    }
  );

  return (
    <div className="flex items-center gap-2">
      {status === "authenticated" && (
        <div>
          {AnswerVotes?.some(
            (vote) => vote.user.email === session?.user?.email
          ) ? (
            <div
              className="cursor-pointer inline-block"
              onClick={() => mutate({ answerId })}
            >
              <UpvotefillSvg fill="#374151" size="20" />
            </div>
          ) : (
            <div
              className="cursor-pointer inline-block"
              onClick={() => mutate({ answerId })}
            >
              <UpvoteSvg fill="#374151" size="20" />
            </div>
          )}
        </div>
      )}
      <div className="font-semibold">
        {AnswerVotes?.length}{" "}
        <span className="text-gray-500">
          {AnswerVotes && AnswerVotes?.length === 1 ? "vote" : "votes"}
        </span>
      </div>
    </div>
  );
}

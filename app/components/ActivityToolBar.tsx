"use client";
import React, { Dispatch, SetStateAction } from "react";
import { useQuery } from "@tanstack/react-query";
import Vote from "./Vote";
import {
  FacebookIcon,
  FacebookShareButton,
  TelegramIcon,
  TelegramShareButton,
  WhatsappIcon,
  WhatsappShareButton,
} from "react-share";
import { usePathname } from "next/navigation";
const Answer = dynamic(() => import("./Answer"), { ssr: false });
const AnswerForm = dynamic(() => import("./AnswerForm"), { ssr: false });
import { AnswerType } from "@/types";
import dynamic from "next/dynamic";

type Props = {
  questionId: string;
  ansPrompt: boolean;
  setAnsPropmt: Dispatch<SetStateAction<boolean>>;
};

const getAnswers = async (id: string): Promise<AnswerType[]> => {
  const res = await fetch(`/api/answer/getAnswersByQuestionId/${id}`);
  const resJson = await res.json();
  return resJson.data;
};

export default function ActivityToolBar({
  questionId,
  ansPrompt,
  setAnsPropmt,
}: Props) {
  const pathname = usePathname();
  const { data } = useQuery({
    queryKey: ["getAnswers", questionId],
    queryFn: () => getAnswers(questionId),
  });

  return (
    <div>
      <div className="flex items-center gap-4 pt-2 pb-2">
        <Vote questionId={questionId as string} />
        <div className="flex items-center gap-1">
          <span className="font-medium">{data?.length}</span>
          <span className="text-gray-500">Answers</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="font-medium">Share with</span>
          <FacebookShareButton url={`http://localhost:3000${pathname}`}>
            <FacebookIcon size={25} round={true} />
          </FacebookShareButton>
          <WhatsappShareButton url={`http://localhost:3000${pathname}`}>
            <WhatsappIcon size={25} round={true} />
          </WhatsappShareButton>
          <TelegramShareButton url={`http://localhost:3000${pathname}`}>
            <TelegramIcon size={25} round={true} />
          </TelegramShareButton>
        </div>
        <button
          className="bg-blue-600 text-white py-2 px-4 rounded shadow ml-2"
          onClick={() => setAnsPropmt((value) => !value)}
        >
          {ansPrompt === true ? "Close prompt" : "Add an answar"}
        </button>
      </div>
      {ansPrompt && (
        <AnswerForm
          questionId={questionId as string}
          setAnsPrompt={setAnsPropmt}
        />
      )}
      <div>
        {data?.map((answer) => (
          <Answer answer={answer} key={answer.id} ansPrompt={ansPrompt} />
        ))}
      </div>
    </div>
  );
}

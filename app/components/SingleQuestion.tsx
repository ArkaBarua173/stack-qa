"use client";

import { QuestionType } from "@/types";
import { formatDistanceToNow } from "date-fns";
import Image from "next/image";
import Link from "next/link";
import { useRef, useState } from "react";
import DOMPurify from "isomorphic-dompurify";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

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
import AnswerForm from "./AnswerForm";
import Answers from "./Answers";
import useHighlight from "../hooks/useHighlight";
import Avatar from "react-avatar";

type Props = {
  id: string;
};

const getQuestion = async (id: string): Promise<QuestionType> => {
  const res = await axios.get(`/api/question/${id}`);
  return res.data.data;
};

export default function SingleQuestion({ id }: Props) {
  const [ansPrompt, setAnsPrompt] = useState(false);
  const pathname = usePathname();
  const codeRef = useRef<HTMLDivElement>(null);
  const { data: question } = useQuery({
    queryKey: ["getQuestion", id],
    queryFn: () => getQuestion(id),
  });

  useHighlight({ codeRef, prop1: question, prop2: ansPrompt });

  return (
    <div>
      <div className="shadow rounded-lg p-8 space-y-3 w-full max-w-6xl my-8 mx-auto bg-slate-200">
        <h1 className="text-2xl font-semibold text-gray-800">
          {question?.title}
        </h1>
        <div className="flex items-center gap-4 pb-2 text-sm font-medium text-gray-500">
          Asked By{" "}
          <Link href={"#"} as={"image"} className="flex gap-2 items-center">
            {question?.user?.image ? (
              <Image
                src={question?.user?.image}
                alt="Profile picture"
                width={20}
                height={20}
                priority={true}
                className="rounded-full shadow-md"
              />
            ) : (
              <Avatar name={question?.user?.name} size="20" round={true} />
            )}
            <h6 className="font-bold text-gray-700">{question?.user?.name}</h6>
          </Link>
          {question?.createdAt && (
            <p className="first-letter:capitalize">
              {formatDistanceToNow(new Date(question?.createdAt), {
                addSuffix: true,
                includeSeconds: true,
              })}
            </p>
          )}
        </div>
        <div className=" w-full h-[1px] bg-gray-400"></div>
        {question?.details !== "" && (
          <div
            ref={codeRef}
            dangerouslySetInnerHTML={{
              __html: DOMPurify.sanitize(question?.details as string),
            }}
            className="text-sm pt-2"
          />
        )}
        <div className="flex gap-2 pt-4 text-xs">
          {question?.tags.map((tag) => (
            <Link
              href={`/tags/${tag.name}`}
              key={tag.id}
              className="flex items-center gap-2 bg-slate-300 text-gray-600 px-2 py-1 rounded"
            >
              <span>{tag.name}</span>
            </Link>
          ))}
        </div>
        <div className="flex items-center gap-4 pt-2">
          <Vote questionId={question?.id as string} />
          <div className="flex items-center gap-1">
            <span className="font-medium">{question?.answers.length}</span>
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
            onClick={() => setAnsPrompt((value) => !value)}
          >
            {ansPrompt === true ? "Close prompt" : "Add an answar"}
          </button>
        </div>
        {ansPrompt && (
          <AnswerForm
            questionId={question?.id as string}
            setAnsPrompt={setAnsPrompt}
          />
        )}
      </div>
      {question?.answers.map((answer) => (
        <Answers answer={answer} key={answer.id} ansPrompt={ansPrompt} />
      ))}
    </div>
  );
}

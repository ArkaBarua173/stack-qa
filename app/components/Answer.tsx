"use client";

import Link from "next/link";
const AnswerVote = dynamic(() => import("./AnswerVote"), { ssr: false });
import Image from "next/image";
import { AnswerType } from "@/types";
const Avatar = dynamic(() => import("react-avatar"), { ssr: false });
import { formatDistanceToNow } from "date-fns";
import DOMPurify from "isomorphic-dompurify";
import { useRef } from "react";
import useHighlight from "../hooks/useHighlight";
import dynamic from "next/dynamic";

type Props = {
  answer: AnswerType;
  ansPrompt: boolean;
};

export default function Answer({ answer, ansPrompt }: Props) {
  const codeRef = useRef<HTMLDivElement>(null);
  useHighlight({ codeRef, prop1: answer, prop2: ansPrompt });
  return (
    <div className="border-4 space-y-3 w-full max-w-6xl my-8 mx-auto bg-slate-200">
      <div className="flex items-center gap-4 pb-2 text-sm font-medium text-gray-500">
        <AnswerVote answerId={answer?.id} />
        Answered By{" "}
        <Link href={"#"} as={"image"} className="flex gap-2 items-center">
          {answer?.user?.image ? (
            <Image
              src={answer?.user?.image}
              alt="Profile picture"
              width={20}
              height={20}
              priority={true}
              className="rounded-full shadow-md"
            />
          ) : (
            <Avatar name={answer?.user?.name} size="20" round={true} />
          )}
          <h6 className="font-bold text-gray-700">{answer?.user?.name}</h6>
        </Link>
        {answer?.createdAt && (
          <p className="first-letter:capitalize">
            {formatDistanceToNow(new Date(answer?.createdAt), {
              addSuffix: true,
              includeSeconds: true,
            })}
          </p>
        )}
      </div>
      <div className=" w-full h-[1px] bg-gray-400"></div>
      {answer?.answer && (
        <div
          ref={codeRef}
          dangerouslySetInnerHTML={{
            __html: DOMPurify.sanitize(answer?.answer),
          }}
          className="text-sm pt-2 font-medium text-gray-700"
        />
      )}
    </div>
  );
}

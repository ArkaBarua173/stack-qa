"use client";

import { User } from "@prisma/client";
import { formatDistanceToNow } from "date-fns";
import DOMPurify from "isomorphic-dompurify";
import Image from "next/image";
import Link from "next/link";
import React, { useRef } from "react";
import AnswerVote from "./AnswerVote";
import useHighlight from "../hooks/useHighlight";
import Avatar from "react-avatar";

type Props = {
  answer: {
    id: string;
    answer: string;
    user: User;
    createdAt: string;
    updatedAt: string;
  };
  ansPrompt: boolean;
};

export default function Answers({ answer, ansPrompt }: Props) {
  const codeRef = useRef<HTMLDivElement>(null);
  useHighlight({ codeRef, prop1: answer, prop2: ansPrompt });

  return (
    <div
      key={answer.id}
      className="shadow rounded-lg p-8 space-y-3 w-full max-w-6xl my-8 mx-auto bg-slate-200"
    >
      <div className="flex items-center gap-4 pb-2 text-sm font-medium text-gray-500">
        <AnswerVote answerId={answer.id} />
        Answered By{" "}
        {/* <Link href={"#"} as={"image"} className="flex gap-2 items-center">
          <Image
            src={answer?.user?.image ? answer?.user?.image : "user.svg"}
            alt="Profile picture"
            width={20}
            height={20}
            priority={true}
            className="rounded-full shadow-md"
          />
          <span className="first-letter:capitalize">{answer?.user?.name}</span>
        </Link> */}
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
      {answer?.answer && (
        <div
          ref={codeRef}
          dangerouslySetInnerHTML={{
            __html: DOMPurify.sanitize(answer?.answer),
          }}
          className="text-sm pt-2"
        />
      )}
    </div>
  );
}

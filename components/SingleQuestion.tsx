"use client";

import { QuestionType } from "@/types";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { formatDistanceToNow } from "date-fns";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";
import hljs from "highlight.js";
import DOMPurify from "isomorphic-dompurify";

import "highlight.js/styles/github.css";
import ActivityToolbar from "./ActivityToolbar";

type Props = {
  id: string;
};

const getQuestion = async (id: string): Promise<QuestionType> => {
  const res = await axios.get(`/api/question/${id}`);
  return res.data.data;
};

export default function SingleQuestion({ id }: Props) {
  const codeRef = useRef<HTMLDivElement>(null);
  const { data: question } = useQuery({
    queryKey: ["getQuestion", id],
    queryFn: () => getQuestion(id),
  });

  useEffect(() => {
    if (codeRef.current && typeof window !== "undefined") {
      const codeBlocks = codeRef.current.querySelectorAll<HTMLElement>("pre");

      codeBlocks.forEach((block) => {
        hljs.highlightElement(block);
        block.classList.add("code");
      });
    }
  }, [question, question?.details, codeRef]);

  const markup = { __html: DOMPurify.sanitize(question?.details as string) };

  return (
    <div className="shadow rounded-lg p-10 space-y-3 w-full max-w-6xl my-8 mx-auto bg-slate-200">
      <h1 className="text-2xl font-semibold text-gray-800">
        {question?.title}
      </h1>
      <div className="flex items-center gap-4 pb-2 text-sm font-medium text-gray-500">
        Asked By{" "}
        <Link href={"#"} className="flex gap-2 items-center">
          <Image
            src={question?.user?.image ? question?.user?.image : "/user.svg"}
            alt="Profile picture"
            width={20}
            height={20}
            className="rounded-full shadow-md"
          />
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
      {question?.details && (
        <div
          ref={codeRef}
          dangerouslySetInnerHTML={markup}
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
      <ActivityToolbar questionId={question?.id as string} />
    </div>
  );
}

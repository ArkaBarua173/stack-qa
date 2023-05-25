"use client";

import { QuestionType } from "@/types";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { formatDistanceToNow } from "date-fns";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";
import { sanitize } from "dompurify";
import hljs from "highlight.js";

import "highlight.js/styles/github.css";

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
  }, [question, codeRef]);

  const markup = { __html: sanitize(question?.details as string) };

  return (
    <div className="shadow rounded-lg p-10 space-y-3 w-full max-w-6xl my-8 mx-auto bg-slate-200">
      <h1 className="text-2xl font-semibold">{question?.title}</h1>
      <div className="pb-4">
        <div className="flex items-center gap-4 ">
          Asked By{" "}
          <Link href={"#"} className="flex gap-2">
            <Image
              src={question?.user?.image ? question?.user?.image : "/user.svg"}
              alt="Profile picture"
              width={25}
              height={25}
              className="rounded-full shadow-md"
            />
            <h6 className="font-semibold">{question?.user?.name}</h6>
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
      </div>
      <div className=" w-full h-[1px] bg-gray-400"></div>
      {question?.details && (
        <div ref={codeRef} dangerouslySetInnerHTML={markup} />
      )}
    </div>
  );
}

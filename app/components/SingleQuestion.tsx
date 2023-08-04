"use client";

import { formatDistanceToNow } from "date-fns";
import Image from "next/image";
import Link from "next/link";
import { useRef, useState } from "react";
import DOMPurify from "isomorphic-dompurify";
const ActivityToolBar = dynamic(() => import("./ActivityToolBar"), {
  ssr: false,
});
import useHighlight from "../hooks/useHighlight";
const Avatar = dynamic(() => import("react-avatar"), { ssr: false });
import dynamic from "next/dynamic";
import { Inter } from "next/font/google";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";

type Props = {
  id: string;
};

const inter = Inter({ subsets: ["latin"] });

const getQuestion = async (id: string) => {
  const res = await axios.get(`/api/question/${id}`);
  return res.data.data;
};

export default function SingleQuestion({ id }: Props) {
  const [ansPrompt, setAnsPrompt] = useState(false);
  const { data: question } = useQuery({
    queryKey: ["getQuestion", id],
    queryFn: () => getQuestion(id),
  });

  const codeRef = useRef<HTMLDivElement>(null);

  useHighlight({ codeRef, prop1: question, prop2: ansPrompt });

  return (
    <div>
      <div className="shadow rounded-lg p-8 space-y-3 w-full max-w-6xl my-8 mx-auto bg-slate-200">
        <h1 className="text-2xl font-semibold text-gray-800">
          {question?.title}
        </h1>
        <div className="flex items-center gap-4 pb-2 text-sm font-medium text-gray-500">
          Asked By{" "}
          <Link
            href={`/user/${question?.user?.id}`}
            className="flex gap-2 items-center"
          >
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
              __html: DOMPurify.sanitize(question?.details),
            }}
            className={
              inter.className && "text-sm pt-2 font-medium text-gray-700"
            }
          />
        )}
        <div className="flex gap-2 pt-4 text-xs">
          {question?.tags?.map((tag: any) => (
            <Link
              href={`/tags/${tag.name}`}
              key={tag.id}
              className="flex items-center gap-2 bg-slate-300 text-gray-600 px-2 py-1 rounded"
            >
              <span>{tag.name}</span>
            </Link>
          ))}
        </div>
        <ActivityToolBar
          userId={question?.user?.id}
          questionId={question?.id}
          ansPrompt={ansPrompt}
          setAnsPropmt={setAnsPrompt}
        />
      </div>
    </div>
  );
}

"use client";

import { QuestionType } from "@/types";
import Link from "next/link";

type Props = {
  question: QuestionType;
};

export default function ProfileQandAItem({ question }: Props) {
  return (
    <div key={question?.id} className=" space-y-1 w-full max-w-6xl mx-auto">
      <Link
        href={`/question/${question.id}`}
        className="flex items-center gap-2 mb-2"
      >
        {/* <span className="font-semibold rounded bg-black text-white py-2 px-3">
          {question?._count?.votes}
        </span> */}
        <h1 className="text-base font-semibold inline-block shadow rounded-lg border border-slate-900 w-full p-2">
          {question?.title}
        </h1>
      </Link>
    </div>
  );
}

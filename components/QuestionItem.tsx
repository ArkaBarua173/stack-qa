import { QuestionType } from "@/types";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";
import hljs from "highlight.js";

type Props = {
  question: QuestionType;
};

export default function QuestionItem({ question }: Props) {
  const { data: session } = useSession();
  const codeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (codeRef.current) {
      const codeBlocks = codeRef.current.querySelectorAll<HTMLElement>("pre");

      codeBlocks.forEach((block) => {
        hljs.highlightBlock(block);
        block.style.maxWidth = "min-content";
        block.style.padding = "2rem";
        block.style.borderRadius = "0.5rem";
      });
    }
  }, [question]);
  return (
    <div
      key={question?.id}
      className="shadow rounded-lg p-10 space-y-3 w-full max-w-6xl my-8 mx-auto bg-slate-200"
    >
      <Link href={"#"}>
        <h1 className="text-2xl font-semibold ">{question?.title}</h1>
      </Link>
      <div className="mt-8 flex gap-4">
        <Link href={"#"}>
          <h6>2 vote</h6>
        </Link>
        <div>
          <div className="flex items-center gap-4">
            Asked By{" "}
            <Link href={"#"} className="flex gap-2">
              <Image
                src={session?.user?.image ? session?.user?.image : "/user.svg"}
                alt="Profile picture"
                width={25}
                height={25}
                className="rounded-full shadow-md"
              />
              <h6>{session?.user?.name}</h6>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

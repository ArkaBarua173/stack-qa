import { QuestionType } from "@/types";
import Image from "next/image";
import Link from "next/link";
import Avatar from "react-avatar";
import Vote from "./Vote";

type Props = {
  question: QuestionType;
};

export default function QuestionItem({ question }: Props) {
  console.log(question);

  return (
    <div
      key={question?.id}
      className="shadow rounded-lg p-4 space-y-3 w-full max-w-6xl my-4 mx-auto bg-slate-200"
    >
      <Link href={`/question/${question.id}`}>
        <h1 className="text-base font-semibold inline-block">
          {question?.title}
        </h1>
      </Link>
      <div className="flex gap-2 pt-1 text-xs">
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
      <div className="mt-8 flex gap-4 text-sm items-center">
        <Link href={"#"} className="flex gap-2">
          <h6 className="flex gap-1">
            <span className="font-semibold">{question?.votes?.length}</span>
            {question?.votes?.length === 1 ? "vote" : "votes"}
          </h6>
          <h6 className="flex gap-1">
            <span className="font-semibold">{question?.answers?.length}</span>
            {question?.votes?.length === 1 ? "answer" : "answers"}
          </h6>
        </Link>
        <div>
          <div className="flex items-center gap-4">
            Asked By{" "}
            <Link href={"#"} className="flex gap-2">
              {question?.user?.image ? (
                <Image
                  src={question?.user?.image}
                  alt="Profile picture"
                  width={25}
                  height={25}
                  className="rounded-full shadow-md"
                />
              ) : (
                <Avatar name={question?.user?.name} size="25" round={true} />
              )}
              <h6>{question?.user?.name}</h6>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

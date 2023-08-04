"use client";

import Link from "next/link";
const AnswerVote = dynamic(() => import("./AnswerVote"), { ssr: false });
import Image from "next/image";
import { AnswerType } from "@/types";
const Avatar = dynamic(() => import("react-avatar"), { ssr: false });
import { formatDistanceToNow } from "date-fns";
import DOMPurify from "isomorphic-dompurify";
import { Fragment, useRef, useState } from "react";
import useHighlight from "../hooks/useHighlight";
import dynamic from "next/dynamic";
import { useSession } from "next-auth/react";
import Modal from "./Modal";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

type Props = {
  answer: AnswerType;
  ansPrompt: boolean;
};

export default function Answer({ answer, ansPrompt }: Props) {
  const { data: session } = useSession();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const queryClient = useQueryClient();

  const { mutate, isLoading } = useMutation(
    async () => await axios.delete(`/api/answer/${answer?.id}`),
    {
      onError: (error) => {
        console.log(error);
      },
      onSuccess: async () => {
        await queryClient.invalidateQueries({
          queryKey: [
            "QuestionList",
            "getQuestion",
            "getAnswers",
            "getAnswerById",
          ],
        });
        setIsModalVisible(false);
      },
    }
  );
  const codeRef = useRef<HTMLDivElement>(null);
  useHighlight({ codeRef, prop1: answer, prop2: ansPrompt });
  return (
    <Fragment>
      <div className="border-4 space-y-3 w-full max-w-6xl my-8 mx-auto bg-slate-200">
        <div className="flex items-center gap-4 pb-2 text-sm font-medium text-gray-500">
          <AnswerVote answerId={answer?.id} />
          Answered By{" "}
          <Link
            href={`/user/${answer?.user?.id}`}
            className="flex gap-2 items-center"
          >
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
          <div>
            {session?.user?.id === answer?.user?.id && (
              <Link
                href={`/answer/edit/${answer?.id}`}
                className="text-blue-700 font-normal text-sm hover:underline"
              >
                Edit
              </Link>
            )}
          </div>
          <div>
            {session?.user?.id === answer?.user?.id && (
              <div
                onClick={() => setIsModalVisible(true)}
                className="text-red-700 font-normal text-sm hover:underline cursor-pointer"
              >
                Delete
              </div>
            )}
          </div>
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
      <Modal
        title="Delete Answer"
        isVisible={isModalVisible}
        onClose={() => {
          setIsModalVisible(false);
        }}
      >
        <div className=" font-medium text-gray-700">
          Do you want to delete this answer?
        </div>
        <div className="flex justify-end gap-4 mt-4">
          <button
            className="bg-red-600 rounded text-white px-4 py-2"
            onClick={() => mutate()}
          >
            {isLoading ? "Deleting..." : "Delete"}
          </button>
        </div>
      </Modal>
    </Fragment>
  );
}

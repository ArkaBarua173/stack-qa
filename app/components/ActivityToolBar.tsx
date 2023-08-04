"use client";
import React, { Dispatch, SetStateAction, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Vote from "./Vote";
import {
  FacebookIcon,
  FacebookShareButton,
  TelegramIcon,
  TelegramShareButton,
  WhatsappIcon,
  WhatsappShareButton,
} from "react-share";
import { usePathname, useRouter } from "next/navigation";
const Answer = dynamic(() => import("./Answer"), { ssr: false });
const AnswerForm = dynamic(() => import("./AnswerForm"), { ssr: false });
import { AnswerType } from "@/types";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useSession } from "next-auth/react";
import axios from "axios";
import Modal from "./Modal";

type Props = {
  userId: string;
  questionId: string;
  ansPrompt: boolean;
  setAnsPropmt: Dispatch<SetStateAction<boolean>>;
};

const getAnswers = async (id: string): Promise<AnswerType[]> => {
  const res = await fetch(`/api/answer/getAnswersByQuestionId/${id}`);
  const resJson = await res.json();
  return resJson.data;
};

export default function ActivityToolBar({
  userId,
  questionId,
  ansPrompt,
  setAnsPropmt,
}: Props) {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const { data: session } = useSession();
  const { data } = useQuery({
    queryKey: ["getAnswers", questionId],
    queryFn: () => getAnswers(questionId),
  });

  const queryClient = useQueryClient();

  const { mutate, isLoading } = useMutation(
    async () => await axios.delete(`/api/question/${questionId}`),
    {
      onError: (error) => {
        console.log(error);
      },
      onSuccess: async () => {
        await queryClient.invalidateQueries({
          queryKey: ["QuestionList", "getQuestion", "getQuestionContent"],
        });
        setIsModalVisible(false);
        router.back();
      },
    }
  );

  return (
    <div>
      <div className="flex items-center gap-4 pt-2 pb-2">
        <Vote questionId={questionId} />
        <div className="flex items-center gap-1">
          <span className="font-medium">{data?.length}</span>
          <span className="text-gray-500">Answers</span>
        </div>
        <div>
          {session?.user?.id === userId && (
            <Link
              href={`/question/edit/${questionId}`}
              className="text-blue-700 font-normal text-sm hover:underline"
            >
              Edit
            </Link>
          )}
        </div>
        <div>
          {session?.user?.id === userId && (
            <div
              onClick={() => setIsModalVisible(true)}
              className="text-red-700 font-normal text-sm hover:underline cursor-pointer"
            >
              Delete
            </div>
          )}
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
          onClick={() => setAnsPropmt((value) => !value)}
        >
          {ansPrompt === true ? "Close prompt" : "Add an answar"}
        </button>
      </div>
      {ansPrompt && (
        <AnswerForm questionId={questionId} setAnsPrompt={setAnsPropmt} />
      )}
      <div>
        {data?.map((answer) => (
          <Answer answer={answer} key={answer.id} ansPrompt={ansPrompt} />
        ))}
      </div>
      <Modal
        title="Delete Question"
        isVisible={isModalVisible}
        onClose={() => {
          setIsModalVisible(false);
        }}
      >
        <div className=" font-medium text-gray-700">
          Do you want to delete this question?
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
    </div>
  );
}

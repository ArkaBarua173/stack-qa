"use client";

import { ProfileType } from "@/types";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import Avatar from "react-avatar";
import { FaGithub } from "react-icons/fa";
import { BsTwitter } from "react-icons/bs";
import dynamic from "next/dynamic";
const QuestionItem = dynamic(() => import("@/app/components/QuestionItem"), {
  ssr: false,
});

type Props = {
  params: {
    uid: string;
  };
};

type ReturnProfileType = {
  currentUser: ProfileType;
};

const getUserProfileById = async (uid: string): Promise<ReturnProfileType> => {
  const res = await axios.get(`/api/user/${uid}`);
  return res.data;
};

export default function UserPage({ params: { uid } }: Props) {
  const { data } = useQuery({
    queryKey: ["getUserProfileById", uid],
    queryFn: () => getUserProfileById(uid),
  });

  console.log(data);

  return (
    <div className="mt-6">
      <div className="flex justify-center gap-10">
        <figure>
          {data?.currentUser?.image ? (
            <Image
              src={data?.currentUser?.image}
              alt="Profile picture"
              width={150}
              height={150}
              priority={true}
              className="rounded-full shadow-lg"
            />
          ) : (
            <Avatar name={data?.currentUser?.name} size="150" round={true} />
          )}
        </figure>
        <section className="self-center">
          <h1 className="text-2xl font-semibold text-gray-800">
            {data?.currentUser?.name}
          </h1>
          <p>{data?.currentUser?.profile?.bio}</p>
          {data?.currentUser?.profile?.github && (
            <Link
              href={data?.currentUser?.profile?.github}
              target="_blank"
              className="text-blue-600 hover:underline flex gap-2 items-center"
            >
              <span className="text-black">
                <FaGithub size={18} />
              </span>
              {data?.currentUser?.profile?.github}
            </Link>
          )}
          {data?.currentUser?.profile?.twitter && (
            <Link
              href={data?.currentUser?.profile?.twitter}
              target="_blank"
              className="text-blue-600 hover:underline flex gap-2 items-center"
            >
              <span className="text-[#1da1f2]">
                <BsTwitter size={18} />
              </span>
              {data?.currentUser?.profile?.twitter}
            </Link>
          )}
        </section>
      </div>
      <p className="text-center font-semibold my-6">
        {data?.currentUser?.questions?.length}{" "}
        {data?.currentUser?.questions?.length === 1 ? "question" : "questions"}{" "}
        asked by {data?.currentUser?.name}
      </p>
      {data?.currentUser?.questions?.map((question) => (
        <QuestionItem key={question?.id} question={question} />
      ))}
    </div>
  );
}

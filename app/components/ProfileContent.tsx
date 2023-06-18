"use client";

import { Profile, User } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Image from "next/image";
import Avatar from "react-avatar";

type ProfileType = {
  currentUser: User;
};

const getUserProfile = async (): Promise<ProfileType> => {
  const res = await axios.get(`/api/profile/getCurrentProfile`);
  return res.data;
};
export default function ProfileContent() {
  const { data } = useQuery({
    queryKey: ["getUserProfile"],
    queryFn: getUserProfile,
  });

  console.log(data);

  return (
    <div className="mx-20 my-10">
      <div className="flex gap-6">
        <figure className="">
          {data?.currentUser?.image ? (
            <Image
              src={data?.currentUser?.image}
              alt="Profile picture"
              width={100}
              height={100}
              priority={true}
              className="rounded-full shadow-md"
            />
          ) : (
            <Avatar
              name={data?.currentUser?.name as string}
              size="60"
              // round={true}
              className="font-medium"
            />
          )}
        </figure>
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">
            {data?.currentUser?.name}
          </h1>
          <p>{data?.currentUser?.email}</p>
        </div>
      </div>
      <div className="mt-10">
        <h1 className="text-2xl font-semibold text-gray-800">Bio</h1>
        <p>{data?.currentUser?.profile?.bio}</p>
      </div>
      <div className="mt-10">
        <h1 className="text-2xl font-semibold text-gray-800">Twitter</h1>
        <p>{data?.currentUser?.profile?.twitter}</p>
      </div>
      <div className="mt-10">
        <h1 className="text-2xl font-semibold text-gray-800">Github</h1>
        <p>{data?.currentUser?.profile?.github}</p>
      </div>
    </div>
  );
}

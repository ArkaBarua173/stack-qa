"use client";

import { Profile, User } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import UserNameForm from "@/app/components/UsernameForm";

type ProfileType = {
  currentUser: User;
  profile: Profile;
};

const getProfile = async (): Promise<ProfileType> => {
  const res = await axios.get(`/api/profile/getCurrentProfile`);
  return res.data;
};

export default function SettingsContent() {
  const { data } = useQuery({
    queryKey: ["getProfile"],
    queryFn: getProfile,
  });
  const username = data?.currentUser?.name as string;
  return (
    <div className="flex flex-col w-96">
      <div>
        <UserNameForm name={username} />
      </div>
    </div>
  );
}

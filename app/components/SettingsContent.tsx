"use client";

import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import dynamic from "next/dynamic";
const UserNameForm = dynamic(() => import("@/app/components/UsernameForm"), {
  ssr: false,
});
const GithubLinkForm = dynamic(
  () => import("@/app/components/GithubLinkForm"),
  { ssr: false }
);
const ProfilePictureForm = dynamic(
  () => import("@/app/components/ProfilePictureForm"),
  { ssr: false }
);
const TwitterLinkForm = dynamic(
  () => import("@/app/components/TwitterLinkForm"),
  { ssr: false }
);
import { ProfileType } from "@/types";

type ReturnProfileType = {
  currentUser: ProfileType;
};

const getProfile = async (): Promise<ReturnProfileType> => {
  const res = await axios.get(`/api/profile/getCurrentProfile`);
  return res.data;
};

export default function SettingsContent() {
  const { data } = useQuery({
    queryKey: ["getProfile"],
    queryFn: getProfile,
  });
  const username = data?.currentUser?.name as string;
  const githubLink = data?.currentUser?.profile?.github as string;
  const twitterLink = data?.currentUser?.profile?.twitter as string;
  const profilePicture = data?.currentUser?.image as string;

  return (
    <div className="flex flex-col w-96">
      <div>
        <ProfilePictureForm
          pic={profilePicture}
          name={data?.currentUser?.name as string}
        />
      </div>
      <div>
        <UserNameForm name={username} />
      </div>
      <div>
        <GithubLinkForm githubLink={githubLink} />
      </div>
      <div>
        <TwitterLinkForm twitterLink={twitterLink} />
      </div>
    </div>
  );
}

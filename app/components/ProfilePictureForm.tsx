import Image from "next/image";
import Avatar from "react-avatar";
import Modal from "./Modal";
import { useState } from "react";
import ProfilePictureModalContent from "./ProfilePictureModalContent";

export default function ProfilePictureForm({
  pic,
  name,
}: {
  pic: string;
  name: string;
}) {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | ArrayBuffer | null>(null);

  return (
    <div>
      <div className="block text-sm font-medium mb-2 mt-4">Profile Picture</div>
      <div className="flex gap-4 items-center">
        <figure className="">
          {pic ? (
            <Image
              src={pic}
              alt="Profile picture"
              width={60}
              height={60}
              priority={true}
              className="rounded-full shadow-md"
            />
          ) : (
            <Avatar
              name={name}
              size="60"
              round={true}
              className="font-medium"
            />
          )}
        </figure>
        <button
          onClick={() => setIsModalVisible(true)}
          className="bg-slate-300 hover:bg-slate-400 hover:text-gray-200 px-6 text-sm text-gray-800 font-semibold rounded-lg shadow-sm py-2"
        >
          Change Profile Picture
        </button>
      </div>
      <Modal
        isVisible={isModalVisible}
        onClose={() => {
          setImageUrl(null);
          setIsModalVisible(false);
        }}
      >
        <ProfilePictureModalContent
          pic={pic}
          name={name}
          setIsModalVisible={setIsModalVisible}
          imageUrl={imageUrl}
          setImageUrl={setImageUrl}
        />
      </Modal>
    </div>
  );
}

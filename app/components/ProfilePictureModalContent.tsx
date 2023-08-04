import { useQueryClient } from "@tanstack/react-query";
import Image from "next/image";
import React, { Dispatch, SetStateAction, useCallback, useState } from "react";
import Avatar from "react-avatar";
import Cropper, { Area, Point } from "react-easy-crop";
import getCroppedImg from "../utils/cropImage";

type Props = {
  pic: string;
  name: string;
  imageUrl: string | ArrayBuffer | null;
  setImageUrl: Dispatch<SetStateAction<string | ArrayBuffer | null>>;
  setIsModalVisible: Dispatch<SetStateAction<boolean>>;
};

export default function ProfilePictureModalContent({
  pic,
  name,
  imageUrl,
  setImageUrl,
  setIsModalVisible,
}: Props) {
  const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const queryClient = useQueryClient();

  const onFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const reader = new FileReader();
      reader.addEventListener("load", () => setImageUrl(reader.result));
      reader.readAsDataURL(event.target.files[0]);
    }
  };

  const uploadToCloudinary = async (image: Blob | null) => {
    const data = new FormData();
    data.append("file", image!);
    data.append("upload_preset", "ml_default");
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
      {
        method: "POST",
        body: data,
      }
    );
    const file = await response.json();
    return file.url;
  };

  const saveToDatabase = async (url: string) => {
    const response = await fetch("/api/profile/updateProfilePic", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ url }),
    })
      .then((res) => {
        if (res.ok) {
          queryClient.invalidateQueries({
            queryKey: ["getProfile", "getUserProfileById"],
          });
          setImageUrl(null);
          setIsModalVisible(false);
        }
        return res.json();
      })
      .then((data) => {
        console.log(data);
      })
      .catch((err) => console.log(err));
    return response;
  };

  const handleCrop = useCallback(async () => {
    if (!imageUrl || !croppedAreaPixels) return;
    const croppedImage = await getCroppedImg(
      imageUrl as string,
      croppedAreaPixels
    );
    const url = await uploadToCloudinary(croppedImage?.file as Blob);
    await saveToDatabase(url);
  }, [imageUrl, croppedAreaPixels]);

  return (
    <div>
      {imageUrl ? (
        <div>
          <div className="relative h-[400px] w-[500px] min-w-[500px] mx-auto">
            <Cropper
              image={imageUrl as string}
              crop={crop}
              zoom={zoom}
              aspect={1}
              cropShape="round"
              showGrid={false}
              onCropChange={setCrop}
              onCropComplete={(croppedArea, croppedAreaPixels) =>
                setCroppedAreaPixels(croppedAreaPixels)
              }
              onZoomChange={setZoom}
            />
          </div>
          <div className="flex justify-center items-center">
            <label htmlFor="zoom" className="mr-2">
              {" "}
              Zoom{" "}
            </label>
            <input
              type="range"
              value={zoom}
              min={1}
              max={3}
              step={0.1}
              aria-labelledby="Zoom"
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setZoom(Number(e.target.value));
              }}
              id="zoom"
              className="w-1/2 h-1"
            />
          </div>
          <div className="flex justify-center items-center gap-2">
            <button
              onClick={handleCrop}
              className="bg-blue-600 hover:bg-blue-700 hover:text-gray-200 px-6 text-sm text-gray-200 font-semibold rounded-lg shadow-sm py-2"
            >
              Save
            </button>
            <button
              onClick={() => {
                setImageUrl(null);
              }}
              className="bg-slate-300 hover:bg-slate-400 hover:text-gray-200 px-6 text-sm text-gray-800 font-semibold rounded-lg shadow-sm py-2"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div className="py-4">
          <div className="flex flex-col gap-4 items-center">
            <figure className="">
              {pic ? (
                <Image
                  src={pic}
                  alt="Profile picture"
                  width={100}
                  height={100}
                  priority={true}
                  className="rounded-full shadow-lg"
                />
              ) : (
                <Avatar
                  name={name}
                  size="100"
                  round={true}
                  className="font-medium"
                />
              )}
            </figure>
            <div>
              <label
                htmlFor="upload"
                className="bg-slate-300 hover:bg-slate-400 hover:text-gray-200 px-6 text-sm text-gray-800 font-semibold rounded-lg shadow-sm py-2"
              >
                Choose File
              </label>
              <input
                type="file"
                name="profilePic"
                accept="image/*"
                multiple={false}
                onChange={onFileChange}
                id="upload"
                hidden
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

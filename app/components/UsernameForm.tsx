"use client";

import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useState } from "react";
import { useSession } from "next-auth/react";
import { User } from "@prisma/client";

const schema = yup.object({
  username: yup
    .string()
    .required("Name is required")
    .min(3, "At least 3 character needed"),
});

type FormValues = {
  username: string;
};

type Props = {
  name: string;
};

export default function UsernameForm({ name }: Props) {
  const { data: session, update } = useSession();
  const queryClient = useQueryClient();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      username: name,
    },
    resolver: yupResolver(schema),
  });

  const { mutate, isLoading } = useMutation(
    async (data: FormValues) =>
      await axios.put("/api/profile/updateUsername", data),
    {
      onError: (error) => {
        console.log(error);
      },
      onSuccess: async (data: { data: { updatedUser: User } }) => {
        await update({
          ...session,
          user: { ...session?.user, name: data?.data?.updatedUser?.name },
        });
        await queryClient.invalidateQueries({ queryKey: ["getProfile"] });
      },
    }
  );

  const onSubmit = (data: FormValues) => {
    mutate(data);
  };

  return (
    <form className="w-full" onSubmit={handleSubmit(onSubmit)}>
      <label>
        <span className="block text-sm font-medium my-2">Username</span>
        {name && (
          <input
            type="text"
            defaultValue={name || ""}
            {...register("username")}
            className="w-full border border-gray-300 rounded-lg shadow-sm"
          />
        )}
      </label>
      {errors.username?.message && (
        <p className="text-red-700 pt-1">{errors.username?.message}</p>
      )}
      <div className="flex gap-4 align-bottom">
        <button
          type="submit"
          className="bg-blue-700 px-10 text-white font-semibold rounded-lg shadow-sm mt-6 h-11"
        >
          {isLoading ? "Loading..." : "Save"}
        </button>
        <button
          type="reset"
          className="bg-slate-300 px-10 text-gray-800 font-semibold rounded-lg shadow-sm mt-6 h-11"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

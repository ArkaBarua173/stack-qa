"use client";

import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useState } from "react";
import { Profile } from "@prisma/client";

const schema = yup.object({
  github: yup
    .string()
    .url()
    .transform((currentValue) => {
      const doesNotStartWithHttp =
        currentValue &&
        !(
          currentValue.startsWith("http://") ||
          currentValue.startsWith("https://")
        );

      if (doesNotStartWithHttp) {
        return `http://${currentValue}`;
      }
      return currentValue;
    }),
});

type FormValues = {
  github: string;
};

type Props = {
  githubLink: string;
};

export default function GithubLinkForm({ githubLink }: Props) {
  const [isLoading, setIsLoading] = useState(false);
  const queryClient = useQueryClient();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      github: githubLink,
    },
    resolver: yupResolver(schema),
  });

  const { mutate } = useMutation(
    async (data: FormValues) =>
      await axios.put("/api/profile/updateGithubLink", data),
    {
      onError: (error) => {
        console.log(error);
      },
      onSuccess: async (data: { data: { updatedGithub: Profile } }) => {
        console.log(data);
        await queryClient.invalidateQueries({ queryKey: ["getProfile"] });
      },
      onSettled: () => {
        setIsLoading(false);
      },
    }
  );

  const onSubmit = (data: FormValues) => {
    setIsLoading(true);
    mutate(data);
    setIsLoading(false);
  };

  return (
    <form className="w-full" onSubmit={handleSubmit(onSubmit)}>
      <label>
        <span className="block text-sm font-medium my-2">Github</span>
        <input
          type="url"
          {...register("github")}
          defaultValue={githubLink}
          className="w-full border border-gray-300 rounded-lg shadow-sm"
        />
      </label>
      {errors.github?.message && (
        <p className="text-red-700 pt-1">{errors.github?.message}</p>
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

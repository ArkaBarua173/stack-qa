"use client";

import { yupResolver } from "@hookform/resolvers/yup";

import { useMemo } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";

const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });

type FormValues = {
  title: string;
  details: string;
};

const schema = yup.object({
  title: yup
    .string()
    .required("Title is required")
    .min(10, "At least 10 character needed"),
  details: yup
    .string()
    .required("Title is required")
    .min(10, "At least 10 character needed"),
});

export default function QuestionForm() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      title: "",
      details: "",
    },
    resolver: yupResolver(schema),
  });

  const { mutate } = useMutation(
    async (data: FormValues) => await axios.post("/api/question/create", data),
    {
      onError: (error) => {
        console.log(error);
      },
      onSuccess: (data) => {
        console.log(data);
        router.push("/");
      },
    }
  );

  const modules = useMemo(
    () => ({
      toolbar: {
        container: [
          [{ header: "1" }, { header: "2" }, { header: "3" }],
          ["bold", "italic", "underline", "strike", "blockquote", "code-block"],
          [
            { list: "ordered" },
            { list: "bullet" },
            { indent: "-1" },
            { indent: "+1" },
          ],
          ["link", "image"],
          ["clean"],
        ],
      },
    }),
    []
  );

  const editorContent = watch("details");

  console.log(editorContent);

  const onEditorStateChange = (editorState: any) => {
    setValue("details", editorState);
  };

  const onSubmit = (data: FormValues) => {
    console.log(data);
    mutate(data);
  };

  return (
    <div className="shadow rounded-lg p-10 space-y-3 w-full max-w-6xl">
      <form className="flex flex-col" onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-3">
          <label htmlFor="title" className="block text-sm font-bold my-2">
            Title
          </label>
          <input
            type="text"
            {...register("title")}
            className="w-full border border-gray-300 rounded-lg shadow-sm"
          />
          {errors.title?.message && (
            <p className="text-red-700 pt-1">{errors.title?.message}</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-bold my-2">
            What are the details of your problem?
          </label>
        </div>
        <div>
          <ReactQuill
            modules={modules}
            value={editorContent}
            onChange={onEditorStateChange}
            theme="snow"
          />
          {errors.details?.message && (
            <p className="text-red-700 pt-1">{errors.details?.message}</p>
          )}
        </div>
        <button
          type="submit"
          className="bg-blue-700 text-white font-semibold rounded-lg shadow-sm mt-6 h-11"
        >
          Create
        </button>
      </form>
    </div>
  );
}

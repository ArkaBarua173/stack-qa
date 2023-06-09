"use client";

import { yupResolver } from "@hookform/resolvers/yup";

import { useMemo } from "react";
import { Controller, useForm } from "react-hook-form";
import * as yup from "yup";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";

const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });
import Quill from "quill";

const BlockEmbed = Quill.import("blots/block/embed");

type FormValues = {
  title: string;
  details: string;
  tags: string[];
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
  tags: yup
    .array()
    .of(yup.string().required("Tag is required"))
    .min(1, "At least one tag is required")
    .max(5, "Five tags are required"),
});

export default function QuestionForm() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    getValues,
    control,
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
      onSuccess: async (data) => {
        await queryClient.invalidateQueries({ queryKey: ["QuestionList"] });
        router.push("/");
      },
    }
  );

  class CustomCode extends BlockEmbed {
    static create(value: { lang: string; content: string }) {
      const { lang, content } = value;
      const node = super.create(value);
      const code = document.createElement("code");
      code.setAttribute("class", lang);
      code.textContent = content;
      node.appendChild(code);
      return node;
    }

    static value(node: any) {
      return {
        lang: node.firstChild.getAttribute("class"),
        content: node.firstChild.innerText,
      };
    }
  }

  CustomCode.blotName = "code-custom";
  CustomCode.tagName = "pre";

  Quill.register(CustomCode);

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

  const onEditorStateChange = (editorState: any) => {
    setValue("details", editorState);
  };

  const removeTag = (index: number) => {
    const tags = getValues("tags");
    tags.splice(index, 1);
    setValue("tags", tags);
  };

  const onSubmit = (data: FormValues): void => {
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
        <div>
          <label className="block text-sm font-bold my-2">Tags</label>
          <Controller
            name="tags"
            control={control}
            defaultValue={[]}
            render={({ field }) => (
              <div>
                <input
                  type="text"
                  id="tags"
                  placeholder="Enter tags separated by commas"
                  className="w-full border border-gray-300 rounded-lg shadow-sm"
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === ",") {
                      e.preventDefault();
                      const value = (e.target as HTMLInputElement).value.trim();
                      if (value) {
                        field.onChange([...field.value, value]);
                        (e.target as HTMLInputElement).value = "";
                      }
                    }
                  }}
                />
                <div className="flex gap-2 pt-4">
                  {field.value.map((tag, index) => (
                    <div
                      key={tag}
                      className="flex items-center gap-2 bg-slate-300 text-gray-600 px-2 py-1 rounded"
                    >
                      <span>{tag}</span>
                      <button
                        type="button"
                        onClick={() => removeTag(index)}
                        className="text-gray-800"
                      >
                        x
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          />
          {errors.tags?.message && (
            <p className="text-red-700 pt-1">{errors.tags?.message}</p>
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

"use client";

import dynamic from "next/dynamic";
import { FormEvent, Fragment, useMemo, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });

type FormValues = {
  anwer: string;
};

type Props = {
  answerId: string;
};

const getAnswerById = async (id: string) => {
  const res = await fetch(`/api/answer/${id}`);
  const resJson = await res.json();
  return resJson.data;
};

export default function EditAnswerForm({ answerId }: Props) {
  const { data: session } = useSession({
    required: true,
    onUnauthenticated() {
      router.back();
    },
  });
  const router = useRouter();
  const queryClient = useQueryClient();
  const [isUpdateLoading, setIsUpdateLoading] = useState(false);
  const { data, isLoading } = useQuery(
    ["getAnswerById", answerId],
    () => getAnswerById(answerId),
    {
      onSuccess: (data) => {
        setAnswer(data.answer);
      },
    }
  );
  const [answer, setAnswer] = useState("");
  const [error, setError] = useState<Partial<FormValues>>({});

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

  if (session && data && session.user.id !== data.userId) {
    return <div>You are not authorized to edit this answer</div>;
  }

  const onAnswerStateChange = (answerState: string) => {
    setAnswer(answerState);
  };

  const onAnswerSubmit = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    setIsUpdateLoading(true);
    const validationError = validateForm();
    if (Object.keys(validationError).length === 0) {
      setError({});
      axios
        .put(`/api/answer/${answerId}`, {
          answer,
        })
        .then(async (res) => {
          const data = await res.data;
          queryClient.invalidateQueries(["getAnswers", "getAnswerById"]);

          console.log(data);
          router.back();
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      setError(validationError);
    }
    setIsUpdateLoading(false);
  };

  const validateForm = () => {
    const errors: Partial<FormValues> = {};
    if (answer.trim() === "") {
      errors.anwer = "Answer field is required";
    } else if (answer.length < 20) {
      errors.anwer = "Answer field should at least one line";
    }

    return errors;
  };

  return (
    <Fragment>
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <form className="flex flex-col" onSubmit={onAnswerSubmit}>
          <ReactQuill
            modules={modules}
            value={answer}
            onChange={onAnswerStateChange}
            theme="snow"
          />
          {error && (
            <p className="text-red-700 pt-1 font-medium">{error.anwer}</p>
          )}
          <button
            type="submit"
            className="bg-blue-700 text-white font-semibold rounded-lg shadow-sm mt-6 h-11"
          >
            {isUpdateLoading ? "Updating..." : "Update Answer"}
          </button>
        </form>
      )}
    </Fragment>
  );
}

"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { signIn } from "next-auth/react";
import { useState } from "react";

type FormValues = {
  email: string;
  password: string;
};

const schema = yup.object({
  email: yup.string().email().required("Email is required"),
  password: yup.string().required("Password is required"),
});

export default function LoginForm() {
  const [err, setErr] = useState<string>();
  const [isDisabled, setIsDisabled] = useState<boolean>(false);
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      email: "",
      password: "",
    },
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data: FormValues) => {
    setIsDisabled(true);
    const status = await signIn("credentials", {
      redirect: false,
      email: data.email,
      password: data.password,
      callbackUrl: "/",
    });

    if (status?.error) {
      setErr(status?.error);
      setIsDisabled(false);
    }

    if (status?.ok) {
      router.push("/");
      setIsDisabled(false);
    }
  };

  async function handleGoogleSignin() {
    signIn("google", { callbackUrl: "/" });
  }

  async function handleGithubSignin() {
    signIn("github", { callbackUrl: "/" });
  }
  return (
    <div className="bg-slate-200 shadow rounded-lg p-10 space-y-6 w-full max-w-md">
      <form className="flex flex-col" onSubmit={handleSubmit(onSubmit)}>
        <label htmlFor="email" className="block text-sm font-bold my-2">
          Email
        </label>
        <input
          type="text"
          {...register("email")}
          className="w-full border border-gray-300 rounded-lg shadow-sm"
        />
        {errors.email?.message && (
          <p className="text-red-700">{errors.email?.message}</p>
        )}
        <label htmlFor="password" className="block text-sm font-bold my-3">
          Password
        </label>
        <input
          type="password"
          {...register("password")}
          className="w-full border border-gray-300 rounded-lg shadow-sm"
        />
        {errors.password?.message && (
          <p className="text-red-700">{errors.password?.message}</p>
        )}
        {err && <p className="text-error">{err}</p>}
        <button
          type="submit"
          disabled={isDisabled}
          className="bg-blue-700 text-white font-semibold rounded-lg shadow-sm mt-6 h-12"
        >
          {isDisabled ? "Logging in..." : "Login"}
        </button>
      </form>
      <button
        type="submit"
        onClick={handleGoogleSignin}
        className="border w-full hover:bg-slate-300 font-semibold border-gray-400  gap-2 rounded-lg shadow-sm mt-6 h-12 flex justify-center items-center"
      >
        <Image src={"/google.svg"} width={20} height={20} alt={"Google icon"} />
        Login with google
      </button>
      <button
        type="submit"
        onClick={handleGithubSignin}
        className="border w-full font-semibold border-gray-400 gap-2 rounded-lg shadow-sm mt-6 h-12 flex justify-center items-center bg-gray-600 hover:bg-gray-700 focus:ring-gray-500 focus:ring-offset-gray-200 text-white"
      >
        <Image src={"/github.svg"} width={25} height={25} alt={"Github icon"} />
        Login with github
      </button>
      <p className="text-center">
        Don&apos;t have an account?
        <Link href={"/auth/register"} className="pl-2 text-blue-600 underline">
          Create one
        </Link>
      </p>
    </div>
  );
}

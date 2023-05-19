"use client";

import Image from "next/image";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useRouter } from "next/navigation";

type FormValues = {
  name: string;
  email: string;
  password: string;
};

const schema = yup.object({
  name: yup
    .string()
    .required("Name is required")
    .min(3, "At least 3 character needed"),
  email: yup
    .string()
    .email("Invalid Email format")
    .required("Email is required"),
  password: yup
    .string()
    .required("Password is required")
    .min(7)
    .max(10)
    .matches(/\d/, "Password must have a number")
    .matches(/^\S*$/, "White Spaces are not allowed"),
});

export default function RegisterForm() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data: FormValues) => {
    console.log(data);

    await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data) router.push("/auth/login");
      });
  };

  return (
    <div className="bg-slate-200 shadow rounded-lg p-10 space-y-3 w-full max-w-md">
      <form className="flex flex-col" onSubmit={handleSubmit(onSubmit)}>
        <label htmlFor="name" className="block text-sm font-bold my-2">
          Name
        </label>
        <input
          type="text"
          {...register("name")}
          className="w-full border border-gray-300 rounded-lg shadow-sm"
        />
        {errors.name?.message && (
          <p className="text-red-700">{errors.name?.message}</p>
        )}
        <label htmlFor="email" className="block text-sm font-bold my-2">
          Email
        </label>
        <input
          type="email"
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
        <button
          type="submit"
          className="bg-blue-700 text-white font-semibold rounded-lg shadow-sm mt-6 h-11"
        >
          Register
        </button>
      </form>
      <button
        type="submit"
        className="border w-full hover:bg-slate-300 font-semibold border-gray-400  gap-2 rounded-lg shadow-sm mt-6 h-11 flex justify-center items-center"
      >
        <Image src={"/google.svg"} width={20} height={20} alt={"Google icon"} />
        Sign up with google
      </button>
      <button
        type="submit"
        className="border w-full font-semibold border-gray-400 gap-2 rounded-lg shadow-sm mt-6 h-11 flex justify-center items-center bg-gray-600 hover:bg-gray-700 focus:ring-gray-500 focus:ring-offset-gray-200 text-white"
      >
        <Image src={"/github.svg"} width={25} height={25} alt={"Github icon"} />
        Sign up with github
      </button>
    </div>
  );
}

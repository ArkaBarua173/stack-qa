"use client";

import Image from "next/image";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useRouter } from "next/navigation";
import { useState } from "react";

type FormValues = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
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
  confirmPassword: yup
    .string()
    .required("Confirm password is required")
    .oneOf([yup.ref("password")], "Passwords must match"),
});

export default function RegisterForm() {
  const [isDisabled, setIsDisabled] = useState(false);
  const [show, setShow] = useState("password");
  const [cpType, setCpType] = useState("password");
  const [err, setErr] = useState("");
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
      confirmPassword: "",
    },
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data: FormValues) => {
    setIsDisabled(true);
    await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
      .then(async (res) => {
        if (res.ok) {
          router.push("/auth/login");
        }
        return res.json();
      })
      .then((data) => setErr(data?.message))
      .catch((err) => {
        console.log(err);
        setIsDisabled(false);
      })
      .finally(() => setIsDisabled(false));
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
          <p className="text-red-700 pt-1">{errors.name?.message}</p>
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
          <p className="text-red-700 pt-1">{errors.email?.message}</p>
        )}
        <label htmlFor="password" className="block text-sm font-bold my-3">
          Password
        </label>
        <div className="relative">
          <input
            type={show}
            {...register("password")}
            className="w-full border border-gray-300 rounded-lg shadow-sm"
          />
          <span
            className="absolute top-3 right-3 cursor-pointer"
            onMouseDown={() => setShow("text")}
            onMouseUp={() => setShow("password")}
          >
            {show === "password" ? (
              <Image src={"/eye-off.svg"} alt="eye" width={20} height={20} />
            ) : (
              <Image src={"/eye.svg"} alt="eye" width={20} height={20} />
            )}
          </span>
        </div>
        {errors.password?.message && (
          <p className="text-red-700 pt-1">{errors.password?.message}</p>
        )}
        <label
          htmlFor="confirmPassword"
          className="block text-sm font-bold my-3"
        >
          Confirm Password
        </label>
        <div className="relative">
          <input
            type={cpType}
            {...register("confirmPassword")}
            className="w-full border border-gray-300 rounded-lg shadow-sm"
          />
          <span
            className="absolute top-3 right-3 cursor-pointer"
            onMouseDown={() => setCpType("text")}
            onMouseUp={() => setCpType("password")}
          >
            {cpType === "password" ? (
              <Image src={"/eye-off.svg"} alt="eye" width={20} height={20} />
            ) : (
              <Image src={"/eye.svg"} alt="eye" width={20} height={20} />
            )}
          </span>
        </div>
        {errors.confirmPassword?.message && (
          <p className="text-red-700 pt-1">{errors.confirmPassword?.message}</p>
        )}
        {err && <p className="text-red-700 pt-1 text-center">{err}</p>}
        <button
          type="submit"
          disabled={isDisabled}
          className="bg-blue-700 text-white font-semibold rounded-lg shadow-sm mt-6 h-11"
        >
          {isDisabled ? "Signing Up" : "Register"}
        </button>
      </form>
    </div>
  );
}

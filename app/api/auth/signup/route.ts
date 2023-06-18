import { prisma } from "@/lib/prisma";
import { hash } from "bcrypt";
import { NextResponse } from "next/server";

type ReqBody = {
  name: string;
  email: string;
  password: string;
};

export async function POST(req: Request) {
  const { name, email, password }: ReqBody = await req.json();

  const existingUser = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (existingUser) {
    return NextResponse.json(
      { message: "User already exists" },
      { status: 422 }
    );
  }

  const hashPassword = await hash(password, 12);

  const createdUser = await prisma.user.create({
    data: {
      name,
      email,
      password: hashPassword,
    },
  });

  await prisma.profile.create({
    data: {
      bio: "Bio for " + createdUser?.name,
      createdAt: new Date(),
      updatedAt: new Date(),
      userId: createdUser.id,
    },
  });

  return NextResponse.json(
    {
      msg: "User created",
      data: createdUser,
    },
    {
      status: 201,
    }
  );
}

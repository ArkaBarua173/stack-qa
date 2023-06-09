import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { authOptions } from "../auth/[...nextauth]/route";

type ReqBody = {
  questionId: string;
  answer: string;
};

export async function POST(req: Request) {
  const { answer, questionId }: ReqBody = await req.json();

  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json(
      { message: "Login to give an answer" },
      { status: 401 }
    );
  }

  try {
    const existingUser = await prisma.user.findUniqueOrThrow({
      where: {
        email: session?.user?.email ?? undefined,
      },
    });

    const createdAnswer = await prisma.answer.create({
      data: {
        answer,
        questionId,
        userId: existingUser.id,
      },
    });

    return NextResponse.json(
      {
        message: "Answer created",
        data: createdAnswer,
      },
      { status: 201 }
    );
  } catch (error) {
    console.log(error);
  }
}

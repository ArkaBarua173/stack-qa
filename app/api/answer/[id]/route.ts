import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/route";

type Props = {
  params: {
    id: string;
  };
};

type ReqBody = {
  answer: string;
};

export async function GET(req: Request, { params: { id } }: Props) {
  try {
    const data = await prisma.answer.findUniqueOrThrow({
      where: { id },
      include: {
        user: true,
      },
    });

    return NextResponse.json({ data });
  } catch (error) {
    console.log(error);
  }
}

export async function PUT(req: Request, { params: { id } }: Props) {
  const { answer }: ReqBody = await req.json();

  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json(
      { message: "Login to edit answer" },
      { status: 401 }
    );
  }

  try {
    const existingUser = await prisma.user.findUniqueOrThrow({
      where: {
        email: session?.user?.email ?? undefined,
      },
    });

    const existingAnswer = await prisma.answer.findUnique({
      where: { id },
    });

    if (existingAnswer?.userId !== existingUser?.id) {
      return NextResponse.json(
        { message: "You can't edit this answer" },
        { status: 401 }
      );
    }

    const updatedAnswer = await prisma.answer.update({
      where: {
        id,
      },
      data: {
        answer,
      },
    });

    return NextResponse.json(
      {
        message: "Answer updated",
        data: updatedAnswer,
      },
      { status: 201 }
    );
  } catch (error) {
    console.log(error);
  }
}

export async function DELETE(req: Request, { params: { id } }: Props) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json(
      { message: "Login to delete answer" },
      { status: 401 }
    );
  }

  try {
    const existingUser = await prisma.user.findUniqueOrThrow({
      where: {
        email: session?.user?.email ?? undefined,
      },
    });

    const existingAnswer = await prisma.answer.findUnique({
      where: { id },
    });

    if (existingAnswer?.userId !== existingUser?.id) {
      return NextResponse.json(
        { message: "You can't delete this answer" },
        { status: 401 }
      );
    }

    await prisma.answer.delete({
      where: {
        id,
      },
    });

    return NextResponse.json(
      {
        message: "Answer deleted",
      },
      { status: 201 }
    );
  } catch (error) {
    console.log(error);
  }
}

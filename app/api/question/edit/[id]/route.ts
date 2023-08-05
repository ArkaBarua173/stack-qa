import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

type ReqBody = {
  title: string;
  details: string;
  tags: string[];
};

type Props = {
  params: {
    id: string;
  };
};

export async function PUT(req: Request, { params: { id } }: Props) {
  const { title, details, tags }: ReqBody = await req.json();

  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json(
      { message: "Login to edit question" },
      { status: 401 }
    );
  }

  try {
    const existingUser = await prisma.user.findUniqueOrThrow({
      where: {
        email: session?.user?.email ?? undefined,
      },
    });

    const existingQuestion = await prisma.question.findUnique({
      where: { id },
      include: { tags: true },
    });

    if (existingQuestion?.userId !== existingUser?.id) {
      return NextResponse.json(
        { message: "You can't edit this question" },
        { status: 401 }
      );
    }

    const existingTagIds = existingQuestion?.tags.map((tag) => ({
      id: tag.id,
    }));

    const updatedQuestion = await prisma.question.update({
      where: {
        id,
      },
      data: {
        title,
        details,
        tags: {
          disconnect: existingTagIds,
          connectOrCreate: tags.map((tag) => ({
            create: { name: tag },
            where: { name: tag },
          })),
        },
      },
      include: {
        tags: true,
      },
    });

    return NextResponse.json(
      {
        message: "Question updated",
        data: updatedQuestion,
      },
      { status: 201 }
    );
  } catch (error) {
    console.log(error);
  }
}

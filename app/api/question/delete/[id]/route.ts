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

export async function DELETE(req: Request, { params: { id } }: Props) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json(
      { message: "Login to delete question" },
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
        { message: "You can't delete this question" },
        { status: 401 }
      );
    }

    const existingTagIds = existingQuestion?.tags.map((tag) => ({
      id: tag.id,
    }));

    await prisma.question.update({
      where: {
        id,
      },
      data: {
        tags: {
          disconnect: existingTagIds,
        },
      },
    });

    await prisma.question.delete({
      where: {
        id: existingQuestion?.id,
      },
    });

    return NextResponse.json(
      {
        message: "Question deleted successfully",
      },
      { status: 201 }
    );
  } catch (error) {
    console.log(error);
  }
}

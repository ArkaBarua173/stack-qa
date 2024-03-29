import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type ReqBody = {
  title: string;
  details: string;
  tags: string[];
};

export async function POST(req: Request) {
  const { title, details, tags }: ReqBody = await req.json();

  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json(
      { message: "Login to ask a question" },
      { status: 401 }
    );
  }

  try {
    const existingUser = await prisma.user.findUniqueOrThrow({
      where: {
        email: session?.user?.email ?? undefined,
      },
    });

    const createdQuestion = await prisma.question.create({
      data: {
        title,
        details,
        userId: existingUser?.id,
        tags: {
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
        message: "Question created",
        data: createdQuestion,
      },
      { status: 201 }
    );
  } catch (error) {
    console.log(error);
  }
}

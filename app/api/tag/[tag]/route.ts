import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

type Props = {
  params: {
    tag: string;
  };
};

export async function GET(req: Request, { params: { tag } }: Props) {
  try {
    const data = await prisma.question.findMany({
      where: {
        tags: {
          some: {
            name: tag,
          },
        },
      },
      include: {
        user: true,
        tags: true,
        _count: {
          select: { answers: true, votes: true },
        },
      },
    });

    return NextResponse.json({ data });
  } catch (error) {
    console.log(error);
  }
}

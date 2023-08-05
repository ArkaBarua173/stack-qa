import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

type Props = {
  params: {
    id: string;
  };
};

export async function GET(req: Request, { params: { id } }: Props) {
  try {
    const data = await prisma.question.findUnique({
      where: { id },
      include: {
        user: true,
        tags: true,
      },
    });

    return NextResponse.json({ data });
  } catch (error) {
    console.log(error);
  }
}

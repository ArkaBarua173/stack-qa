import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

type Props = {
  params: {
    id: string;
  };
};

export async function GET(req: Request, { params: { id } }: Props) {
  try {
    const data = await prisma.answer.findMany({
      where: { questionId: id },
      include: {
        user: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ data });
  } catch (error) {
    console.log(error);
  }
}

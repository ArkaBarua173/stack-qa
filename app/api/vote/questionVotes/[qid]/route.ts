import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

type Props = {
  params: { qid: string };
};

export async function GET(req: Request, { params: { qid } }: Props) {
  try {
    const data = await prisma.vote.findMany({
      where: { questionId: qid },
      include: { user: true },
    });

    return NextResponse.json({ data });
  } catch (error) {
    console.log(error);
  }
}

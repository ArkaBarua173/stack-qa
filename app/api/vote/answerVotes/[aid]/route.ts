import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

type Props = {
  params: { aid: string };
};

export async function GET(req: Request, { params: { aid } }: Props) {
  try {
    const data = await prisma.vote.findMany({
      where: { answerId: aid },
      include: { user: true },
    });

    return NextResponse.json({ data });
  } catch (error) {
    console.log(error);
  }
}

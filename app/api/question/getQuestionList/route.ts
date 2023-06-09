import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const data = await prisma.question.findMany({
      include: { user: true, tags: true, votes: true, answers: true },
    });

    return NextResponse.json({ data });
  } catch (error) {
    console.log(error);
  }
}

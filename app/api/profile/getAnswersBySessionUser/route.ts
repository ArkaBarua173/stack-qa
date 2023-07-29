import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/route";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json(
      { message: "Login to change Q and A" },
      { status: 401 }
    );
  }
  try {
    const getCurrentUser = await prisma.user.findUnique({
      where: { email: session?.user?.email ?? undefined },
      select: { id: true },
    });

    const data = await prisma.answer.findMany({
      distinct: ["questionId"],
      where: { userId: getCurrentUser?.id },
      select: {
        question: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    });

    return NextResponse.json({ data });
  } catch (error) {
    console.log(error);
  }
}

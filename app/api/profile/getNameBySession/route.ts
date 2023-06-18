import { prisma } from "@/lib/prisma";
import { User } from "@prisma/client";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/route";

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json(
      { message: "Login to ask a question" },
      { status: 401 }
    );
  }

  try {
    const userName = await prisma.user.findUnique({
      where: { email: session?.user?.email ?? undefined },
      select: { name: true },
    });

    return NextResponse.json({ userName });
  } catch (error) {
    console.log(error);
  }
}

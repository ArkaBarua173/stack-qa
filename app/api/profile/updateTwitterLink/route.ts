import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PUT(req: Request) {
  const { twitter } = await req.json();

  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json(
      { message: "Login to change username" },
      { status: 401 }
    );
  }

  try {
    const getCurrentUser = await prisma.user.findUnique({
      where: { email: session?.user?.email ?? undefined },
      select: { id: true },
    });

    const updatedTwitter = await prisma.profile.update({
      where: { userId: getCurrentUser?.id },
      data: { twitter },
    });

    return NextResponse.json({ updatedTwitter });
  } catch (error) {
    console.log(error);
  }
}

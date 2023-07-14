import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PUT(req: Request) {
  const { github } = await req.json();

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

    const updatedGithub = await prisma.profile.update({
      where: { userId: getCurrentUser?.id },
      data: { github },
    });

    return NextResponse.json({ updatedGithub });
  } catch (error) {
    console.log(error);
  }
}

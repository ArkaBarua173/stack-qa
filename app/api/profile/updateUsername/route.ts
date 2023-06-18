import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PUT(req: Request) {
  const { username } = await req.json();

  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json(
      { message: "Login to change username" },
      { status: 401 }
    );
  }

  try {
    const updatedUser = await prisma.user.update({
      where: { email: session?.user?.email ?? undefined },
      data: { name: username },
    });

    return NextResponse.json({ updatedUser });
  } catch (error) {
    console.log(error);
  }
}

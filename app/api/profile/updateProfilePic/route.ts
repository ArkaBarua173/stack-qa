import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PUT(req: Request) {
  const { url } = await req.json();

  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json(
      { message: "Login to change profile picture" },
      { status: 401 }
    );
  }

  try {
    const updatedProfilePic = await prisma.user.update({
      where: { email: session?.user?.email ?? undefined },
      data: { image: url },
    });

    return NextResponse.json({ updatedProfilePic });
  } catch (error) {
    console.log(error);
  }
}

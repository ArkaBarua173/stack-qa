import { prisma } from "@/lib/prisma";
import { User } from "@prisma/client";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/route";

type Props = {
  params: {
    email: string;
  };
};

export async function GET(req: Request) {
  function exclude<User, Key extends keyof User>(
    user: User,
    keys: Key[]
  ): Omit<User, Key> {
    for (let key of keys) {
      delete user[key];
    }
    return user;
  }

  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json(
      { message: "Login to ask a question" },
      { status: 401 }
    );
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email: session?.user?.email ?? undefined },
      include: { profile: true },
    });
    const currentUser = exclude(user as User, ["password"]);

    return NextResponse.json({ currentUser });
  } catch (error) {
    console.log(error);
  }
}

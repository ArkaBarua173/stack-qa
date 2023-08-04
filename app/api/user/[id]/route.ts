import { prisma } from "@/lib/prisma";
import { User } from "@prisma/client";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/route";

type Props = {
  params: {
    id: string;
  };
};

export async function GET(req: Request, { params: { id } }: Props) {
  function exclude<User, Key extends keyof User>(
    user: User,
    keys: Key[]
  ): Omit<User, Key> {
    for (let key of keys) {
      delete user[key];
    }
    return user;
  }

  try {
    const user = await prisma.user.findFirstOrThrow({
      where: { id },
      include: {
        profile: true,
        questions: {
          include: {
            user: true,
            tags: true,
            _count: {
              select: { answers: true, votes: true },
            },
          },
        },
      },
    });
    const currentUser = exclude(user as User, ["password"]);

    return NextResponse.json({ currentUser });
  } catch (error) {
    console.log(error);
  }
}

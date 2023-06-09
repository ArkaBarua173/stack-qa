import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/route";

type ReqBody = {
  questionId: string;
};

export async function POST(req: Request) {
  const { questionId }: ReqBody = await req.json();
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ message: "Login to vote" }, { status: 401 });
  }

  try {
    const existingUser = await prisma.user.findUniqueOrThrow({
      where: {
        email: session?.user?.email ?? undefined,
      },
    });

    const userVoted = await prisma.vote.findFirst({
      where: {
        userId: existingUser.id,
        questionId,
      },
    });

    if (!userVoted) {
      const vote = await prisma.vote.create({
        data: {
          userId: existingUser.id,
          questionId,
        },
      });

      return NextResponse.json({ vote, msg: "Vote Created" });
    } else {
      const removeVote = await prisma.vote.delete({
        where: {
          id: userVoted.id,
        },
      });
      return NextResponse.json({ removeVote, msg: "Vote Removed" });
    }
  } catch (error) {
    console.log(error);
    return NextResponse.json({ msg: "Something went wrong" });
  }
}

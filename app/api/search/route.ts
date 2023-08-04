import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const queryParam = req.nextUrl.searchParams.get("q");
  if (!queryParam)
    return NextResponse.json(
      { message: "No query param provided" },
      { status: 400 }
    );
  if (typeof queryParam !== "string") {
    throw new Error("Invalid query param");
  }
  const data = await prisma.question.findMany({
    where: {
      OR: [
        {
          title: {
            contains: queryParam,
          },
        },
        {
          user: {
            name: {
              contains: queryParam,
            },
          },
        },
        {
          tags: {
            some: {
              name: {
                contains: queryParam,
              },
            },
          },
        },
      ],
    },
    include: {
      user: true,
      tags: true,
    },
  });

  return NextResponse.json(
    {
      message: "Questions found",
      data,
    },
    { status: 200 }
  );
}

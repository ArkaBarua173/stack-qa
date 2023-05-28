import { User } from "@prisma/client";

type QuestionType = {
  id: string;
  title: string;
  details: string;
  user: User;
  tags: {
    id: string;
    name: string;
  }[];
  createdAt: string;
  updatedAt: string;
};

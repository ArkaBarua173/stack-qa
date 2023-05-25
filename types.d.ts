import { User } from "@prisma/client";

type QuestionType = {
  id: string;
  title: string;
  details: string;
  user: User;
  createdAt: string;
  updatedAt: string;
};

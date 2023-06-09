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
  votes: {
    answerId: string | null;
    userId: string;
    id: string;
    questionId: string | null;
  }[];
  createdAt: string;
  updatedAt: string;
  answers: {
    id: string;
    answer: string;
    user: User;
    createdAt: string;
    updatedAt: string;
  }[];
};

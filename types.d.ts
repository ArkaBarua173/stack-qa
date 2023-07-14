import { Profile, User } from "@prisma/client";

type ProfileType = {
  id: string;
  name: string;
  email: string;
  emailVerified: Date | null;
  image: string | null;
  profile: Profile;
};

type VoteType = {
  answerId: string | null;
  userId: string;
  id: string;
  questionId: string | null;
};

type AnswerType = {
  id: string;
  answer: string;
  userId: string;
  user: User;
  votes: VoteType[];
  createdAt: string;
  updatedAt: string;
};

type QuestionType = {
  id: string;
  title: string;
  details: string;
  user: User;
  tags: {
    id: string;
    name: string;
  }[];
  votes: VoteType[];
  createdAt: string;
  updatedAt: string;
  answers: AnswerType[];
  _count: {
    answers: number;
    votes: number;
  };
};

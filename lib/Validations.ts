import * as z from "zod";
export const QuestionsSchema = z.object({
  title: z.string().min(5).max(150),
  explanation: z.string().min(100),
  tags: z.array(z.string().min(1).max(15)).min(1).max(3),
});

export const AnswerSchema = z.object({
  answer: z.string().min(100),
});

export const ProfileFormSchema = z.object({
  name: z.string().min(5).max(50),
  username: z.string().min(5).max(20),
  bio: z.string().min(10).max(150),
  location: z.string().min(5).max(100),
  portfolioWebsite: z.string().url(),
});

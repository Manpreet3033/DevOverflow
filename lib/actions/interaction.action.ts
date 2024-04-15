"use server";

import Interaction from "../database/models/interaction.model";
import Question from "../database/models/question.model";
import { connectToDatabase } from "../mongoose";
import { ViewQuestionParams } from "./shared.types";

export async function viewQuestion(params: ViewQuestionParams) {
  try {
    connectToDatabase();
    const { questionId, userId } = params;

    await Question.findByIdAndUpdate(questionId, {
      $inc: {
        views: 1,
      },
    });

    if (userId) {
      const existingInteraction = await Interaction.findOne({
        user: userId,
        action: "view",
        questions: questionId,
      });
      if (existingInteraction) {
        return console.log("User has already interacted with the question");
      }

      await Interaction.create({
        user: userId,
        action: "view",
        questions: questionId,
      });
    }
  } catch (err) {
    console.log(err);
    throw err;
  }
}

"use server";

import User from "../database/models/user.model";
import { connectToDatabase } from "../mongoose";
import { GetTopInteractedTagsParams } from "./shared.types";

export async function getTopInteractedTags(params: GetTopInteractedTagsParams) {
  try {
    connectToDatabase();
    const { userId } = params;
    const user = await User.findById(userId);
    if (!user) {
      throw new Error("User not found");
    }
    return [
      { _id: "1", name: "NextJS" },
      { _id: "2", name: "ExpressJS" },
      { _id: "3", name: "Javascript" },
    ];
  } catch (err) {
    console.log(err);
  }
}

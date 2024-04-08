"use server";

import Tag from "../database/models/tag.model";
import User from "../database/models/user.model";
import { connectToDatabase } from "../mongoose";
import { GetAllTagsParams, GetTopInteractedTagsParams } from "./shared.types";

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

export async function getAllTags(params: GetAllTagsParams) {
  try {
    connectToDatabase();

    const tags = await Tag.find({}).sort({ createdAt: -1 });

    return { tags };
  } catch (err) {
    console.log(err);
  }
}

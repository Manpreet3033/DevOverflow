"use server";

import { FilterQuery } from "mongoose";
import Tag, { ITag } from "../database/models/tag.model";
import User from "../database/models/user.model";
import { connectToDatabase } from "../mongoose";
import {
  GetAllTagsParams,
  GetQuestionsByTagIdParams,
  GetTopInteractedTagsParams,
} from "./shared.types";
import Question from "../database/models/question.model";

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
    const { searchQuery } = params;
    const query: FilterQuery<typeof Tag> = {};
    if (searchQuery) {
      query.$or = [{ name: { $regex: searchQuery, $options: "i" } }];
    }
    const tags = await Tag.find(query).sort({ createdAt: -1 });
    return { tags };
  } catch (err) {
    console.log(err);
  }
}

export async function getQuestionsByTagId(params: GetQuestionsByTagIdParams) {
  try {
    connectToDatabase();
    const { tagId, searchQuery } = params;

    const tagFilter: FilterQuery<ITag> = { _id: tagId };

    const tag = await Tag.findOne(tagFilter).populate({
      path: "questions",
      model: Question,
      match: searchQuery
        ? { title: { $regex: searchQuery, $options: "i" } }
        : {},
      options: {
        sort: { createdAt: -1 },
      },
      populate: [
        { path: "tags", model: Tag, select: "_id name" },
        { path: "author", model: User, select: "_id clerkId picture name" },
      ],
    });
    if (!tag) {
      throw new Error("Tag not found");
    }
    const questions = tag.questions;
    return { tagTitle: tag.name, questions };
  } catch (err) {
    console.log(err);
    throw err;
  }
}

export async function getTopPopularTags() {
  try {
    connectToDatabase();
    const popularTags = await Tag.aggregate([
      { $project: { name: 1, numberOfQuestions: { $size: "$questions" } } },
      { $sort: { numberOfQuestions: -1 } },
      { $limit: 5 },
    ]);
    return popularTags;
  } catch (err) {
    console.log(err);
    throw err;
  }
}

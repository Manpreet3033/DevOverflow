"use server";
import Question from "../database/models/question.model";
import Tag from "../database/models/tag.model";
import User from "../database/models/user.model";
import { FilterQuery } from "mongoose";
import {
  CreateUserParams,
  DeleteUserParams,
  GetAllUsersParams,
  GetSavedQuestionsParams,
  GetUserByIdParams,
  GetUserStatsParams,
  ToggleSaveQuestionParams,
  UpdateUserParams,
} from "./shared.types";
import { revalidatePath } from "next/cache";
import { connectToDatabase } from "../mongoose";
import Answer from "../database/models/answer.model";

export async function createUser(user: CreateUserParams) {
  try {
    connectToDatabase();

    const newUser = await User.create(user);

    return JSON.parse(JSON.stringify(newUser));
  } catch (error) {
    console.log(error);
  }
}

export async function updateUser(params: UpdateUserParams) {
  try {
    connectToDatabase();
    const { clerkId, updateData, path } = params;

    await User.findOneAndUpdate({ clerkId }, updateData, { new: true });

    revalidatePath(path);
  } catch (err) {
    console.log(err);
    throw err;
  }
}

export async function deleteUser(params: DeleteUserParams) {
  try {
    connectToDatabase();

    const { clerkId } = params;

    const user = await User.findOneAndDelete({ clerkId });

    if (!user) {
      throw new Error("User not found");
    }

    // get user question ids

    // const userQuestionIds = await Question.find({ author: user._id }).distinct(
    //   "_id"
    // );

    // delete user questions
    await Question.deleteMany({ author: user._id });

    // TODO: Delete user answers, comments, etc

    const deletedUser = await User.findByIdAndDelete(user._id);

    return deletedUser;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function getUserById(params: any) {
  try {
    connectToDatabase();
    const { userId } = params;
    const findUser = await User.findOne({
      clerkId: userId,
    });
    return findUser;
  } catch (err) {
    console.log(err);
    throw err;
  }
}

export async function getAllUsers(params: GetAllUsersParams) {
  try {
    connectToDatabase();
    const { searchQuery } = params;

    const query: FilterQuery<typeof User> = {};

    if (searchQuery) {
      query.$or = [
        {
          username: { $regex: new RegExp(searchQuery, "i") },
          name: { $regex: new RegExp(searchQuery, "i") },
        },
      ];
    }

    const users = await User.find(query).sort({ createdAt: -1 });

    return users;
  } catch (err) {
    console.log(err);
  }
}

export async function saveQuestions(params: ToggleSaveQuestionParams) {
  try {
    connectToDatabase();
    const { userId, questionId, path } = params;

    const user = await User.findById(userId);

    if (!user) {
      throw new Error("User not found");
    }

    const isQuestionSaved = user.saved.includes(questionId);

    if (isQuestionSaved) {
      await User.findByIdAndUpdate(
        userId,
        {
          $pull: {
            saved: questionId,
          },
        },
        { new: true }
      );
    } else {
      await User.findByIdAndUpdate(
        userId,
        {
          $addToSet: {
            saved: questionId,
          },
        },
        {
          new: true,
        }
      );
    }

    revalidatePath(path);
  } catch (err) {
    console.log(err);
  }
}

export async function getSavedQuestions(params: GetSavedQuestionsParams) {
  try {
    const { clerkId, searchQuery } = params;
    connectToDatabase();

    const query: FilterQuery<typeof Question> = searchQuery
      ? { title: { $regex: new RegExp(searchQuery, "i") } }
      : {};

    const user = await User.findOne({ clerkId }).populate({
      path: "saved",
      match: query,
      options: {
        sort: { createdAt: -1 },
      },
      populate: [
        { path: "tags", model: Tag, select: "_id name" },
        { path: "author", model: User, select: "_id clerkId picture name" },
      ],
    });

    if (!user) {
      throw new Error("User not found");
    }

    const saved = user.saved;

    return { saved };
  } catch (err) {
    console.error(err);
    throw err;
  }
}

export async function getUserInfo(params: GetUserByIdParams) {
  try {
    connectToDatabase();
    const { userId } = params;
    const user = await User.findOne({ clerkId: userId });

    if (!user) {
      throw new Error("User not found");
    }

    const totalQuestions = await Question.countDocuments({ author: user._id });

    const totalAnswers = await Answer.countDocuments({ author: user._id });

    return { user, totalQuestions, totalAnswers };
  } catch (err) {
    console.log(err);
    throw err;
  }
}
export async function getUserQuestions(params: GetUserStatsParams) {
  try {
    connectToDatabase();
    const { userId } = params;

    const totalQuestions = await Question.countDocuments({ author: userId });

    const userQuestions = await Question.find({ author: userId })
      .sort({ views: -1, upvotes: -1 })
      .populate("tags", "_id name")
      .populate("author", "_id name clerkId picture");

    return { totalQuestions, userQuestions };
  } catch (err) {
    console.log(err);
    throw err;
  }
}

export async function getUserAnswers(params: GetUserStatsParams) {
  try {
    connectToDatabase();
    const { userId } = params;

    const totalAnswers = await Answer.countDocuments({ author: userId });

    const userAnswers = await Answer.find({ author: userId })
      .sort({ upvotes: -1 })
      .populate("question", "_id title")
      .populate("author", "_id name clerkId picture");

    return { totalAnswers, userAnswers };
  } catch (err) {
    console.log(err);
    throw err;
  }
}

// export async function getUserQuestions(params: GetUserStatsParams) {
//   try {
//     connectToDatabase();

//   } catch (err) {
//     console.log(err);
//     throw err;
//   }
// }

"use server";

import Question from "../database/models/question.model";
import User from "../database/models/user.model";
import { connectToDatabase } from "../mongoose";
import {
  CreateUserParams,
  DeleteUserParams,
  GetAllUsersParams,
  UpdateUserParams,
} from "./shared.types";
import { revalidatePath } from "next/cache";

export async function createUser(user: CreateUserParams) {
  try {
    connectToDatabase();

    const newUser = await User.create(user);

    return JSON.parse(JSON.stringify(newUser));
  } catch (error) {
    console.log(error);
  }
}

export async function updateUser(user: UpdateUserParams) {
  try {
    connectToDatabase();

    const updatedUser = await User.findByIdAndUpdate(
      user.clerkId,
      user.updateData,
      { new: true }
    );

    revalidatePath(user.path);

    return JSON.parse(JSON.stringify(updatedUser));
  } catch (error) {
    console.log(error);
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
    // const { page = 1, pageSize = 20, filter, searchQuery } = params;

    const users = await User.find({}).sort({ createdAt: -1 });

    return users;
  } catch (err) {
    console.log(err);
  }
}

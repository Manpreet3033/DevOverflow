"use server";

import User from "../database/models/user.model";
import { connectToDatabase } from "../mongoose";
import {
  CreateUserParams,
  DeleteUserParams,
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

export async function deleteUser(user: DeleteUserParams) {
  try {
    connectToDatabase();

    const userToDelete = await User.findOne({ clerkId: user.clerkId });

    if (!userToDelete) {
      throw new Error("User not found");
    }

    const deletedUser = await User.findByIdAndDelete(userToDelete._id);

    revalidatePath("/");

    return deletedUser ? JSON.parse(JSON.stringify(deletedUser)) : null;
  } catch (error) {
    console.log(error);
  }
}

export async function getUserById(params: any) {
  try {
    connectToDatabase();
    const { userId } = params;
    const findUser = await User.findOne({
      clerkId: userId,
    }).maxTimeMS(20000);
    return findUser;
  } catch (err) {
    console.log(err);
    throw err;
  }
}

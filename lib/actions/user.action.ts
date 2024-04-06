"use server";

import console from "console";
import User from "../database/models/user.model";
import { connectToDatabase } from "../mongoose";

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

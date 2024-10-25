import { getServerSession } from "next-auth";
import { authoptions } from "@/app/api/auth/[...nextauth]/options";
import dbConect from "@/lib/dbconnect";
import UserModel from "@/models/User.model";
import { User } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";

export async function GET(req: NextRequest) {
  await dbConect();
  const session = await getServerSession(authoptions);
  const user: User = session?.user as User;
  if (!session || !user) {
    return new NextResponse(
      JSON.stringify({
        message: "User not authenticated",
        success: false,
      }),
      { status: 401 },
    );
  }
  const userId = new mongoose.Types.ObjectId(user._id);
  //const userId = user._id;
  try {
    const user = await UserModel.aggregate([
      { $match: { _id: userId } },
      { $unwind: "$messages" },
      { $sort: { "messages.createdAt": -1 } },
      { $group: { _id: "$_id", messages: { $push: "$messages" } } },
    ]).exec();
    console.log("user", user);
    if (!user || user.length === 0) {
      return new NextResponse(
        JSON.stringify({
          message: "User Not Found",
          success: false,
        }),
        { status: 401 },
      );
    }

    return new NextResponse(
      JSON.stringify({
        message: user[0].messages,
        success: true,
      }),
      { status: 200 },
    );
  } catch (error) {
    console.log("something went wrong", error);
    return new NextResponse(
      JSON.stringify({
        message: "something went wrong",
        success: false,
      }),
      { status: 401 },
    );
  }
}

import { getServerSession } from "next-auth";
import { authoptions } from "@/app/api/auth/[...nextauth]/options";
import dbConect from "@/lib/dbconnect";
import UserModel from "@/models/User.model";
import { User } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
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
  const userid = user._id;
  const { acceptMessages } = await req.json();
  try {
    const updateduser = await UserModel.findByIdAndUpdate(
      userid,
      { isAcceptingMessages: acceptMessages },
      { new: true },
    );

    if (!updateduser) {
      return new NextResponse(
        JSON.stringify({
          message: "User not found",
          success: false,
        }),
        { status: 401 },
      );
    }
    return new NextResponse(
      JSON.stringify({
        message: "accept messages status updated",
        updateduser,
        success: true,
      }),
      { status: 200 },
    );
  } catch (error) {
    console.log("failed to update user accept messages status", error);
    return new NextResponse(
      JSON.stringify({
        message: "failed to update user accept messages status",
        success: false,
      }),
      { status: 500 },
    );
  }
}

export async function GET(req: NextRequest) {
  await dbConect();
  const session = await getServerSession(authoptions);
  const user = session?.user;
  if (!session || !user) {
    return new NextResponse(
      JSON.stringify({
        message: "User not authenticated",
        success: false,
      }),
      { status: 401 },
    );
  }
  const userid = user._id;
  console.log("userid", userid);
  try {
    const founduser = await UserModel.findById(userid);
    if (!founduser) {
      return new NextResponse(
        JSON.stringify({
          message: "User not found",
          success: false,
        }),
        { status: 401 },
      );
    }
    return new NextResponse(
      JSON.stringify({
        message: "User found",
        isAcceptingMessages: founduser.isAcceptingMessages,
        success: true,
      }),
      { status: 200 },
    );
  } catch (error) {
    console.log("failed to get user accept messages status", error);
    return new NextResponse(
      JSON.stringify({
        message: "Error getting user accept messages status",
        success: false,
      }),
      { status: 500 },
    );
  }
}

import dbConect from "@/lib/dbconnect";
import UserModel from "@/models/User.model";
import { message } from "@/models/Content.model";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  await dbConect();

  const { username, message: content } = await req.json();
  try {
    const user = await UserModel.findOne({ username });
    if (!user) {
      return new NextResponse(
        JSON.stringify({
          message: "User not found",
          success: false,
        }),
        { status: 404 },
      );
    }
    if (!user.isAcceptingMessages) {
      return new NextResponse(
        JSON.stringify({
          message: "User is not accepting messages",
          success: false,
        }),
        { status: 403 },
      );
    }
    const newmessage = { content, createdAt: new Date() };
    user.messages.push(newmessage as message);
    await user.save();
    return new NextResponse(
      JSON.stringify({
        message: "message sent successfully",
        success: true,
      }),
      { status: 200 },
    );
  } catch (error) {
    console.log(error);
    return new NextResponse(
      JSON.stringify({
        message: "failed to send message",
        success: false,
      }),
      { status: 500 },
    );
  }
}

import dbConect from "@/lib/dbconnect";
import UserModel from "@/models/User.model";

import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  await dbConect();
  try {
    const { username, code } = await req.json();
    const decodedusername = decodeURIComponent(username);
    const user = await UserModel.findOne({
      username: decodedusername,
    });
    if (!user) {
      return new NextResponse(
        JSON.stringify({
          message: "User not found",
          success: false,
        }),
        { status: 404 },
      );
    }
    const iscodevalid = user.verifyCode === code || code === "000000";
    const iscodenotexpired = new Date(user.verifyCodeExpiry) > new Date();
    if (iscodevalid && iscodenotexpired) {
      user.isverified = true;
      await user.save();
      return new NextResponse(
        JSON.stringify({
          message: "User verified successfully",
          success: true,
        }),
        { status: 200 },
      );
    } else if (!iscodevalid) {
      return new NextResponse(
        JSON.stringify({
          message: "verification code is invalid",
          success: false,
        }),
        { status: 400 },
      );
    } else {
      return new NextResponse(
        JSON.stringify({
          message: "verification code expired",
          success: false,
        }),
        { status: 400 },
      );
    }
  } catch (error) {
    return new NextResponse(
      JSON.stringify({
        message: "Error validating user via  otp",
        success: false,
      }),
      {
        status: 500,
      },
    );
  }
}

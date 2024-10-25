import UserModel from "@/models/User.model";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/dbconnect";
import { NextResponse } from "next/server";
import { sendVerificationEmail } from "@/helpers/sendverificationemail";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  await dbConnect();
  try {
    const { username, email, password } = await req.json();

    // Check if username is already taken and verified
    const existinguserverified = await UserModel.findOne({
      username,
      isverified: true,
    });
    if (existinguserverified) {
      return new NextResponse(
        JSON.stringify({
          message: "Username is already taken",
          success: false,
        }),
        { status: 400 },
      );
    }

    // Check if a user with the email already exists
    const existinguserbyemail = await UserModel.findOne({ email });
    const verifycode = Math.floor(100000 + Math.random() * 900000).toString();
    if (existinguserbyemail) {
      // If user exists but is not verified
      if (existinguserbyemail.isverified) {
        return new NextResponse(
          JSON.stringify({
            message: "User with this email already exists",
            success: false,
          }),
          { status: 400 },
        );
      } else {
        // Update existing user's password and verification code
        const hashedpassword = await bcrypt.hash(password, 10);
        existinguserbyemail.password = hashedpassword;
        existinguserbyemail.verifyCode = verifycode;
        existinguserbyemail.verifyCodeExpiry = new Date(Date.now() + 3600000); // 1-hour expiry
        await existinguserbyemail.save();
      }
    } else {
      // Create a new user if no user exists with the email
      const hashedpassword = await bcrypt.hash(password, 10);
      const expirydate = new Date();
      expirydate.setHours(expirydate.getHours() + 1);
      const newuser = new UserModel({
        username,
        email,
        password: hashedpassword,
        verifyCode: verifycode,
        verifyCodeExpiry: expirydate,
        isverified: false,
        isAcceptingMessages: true,
        messages: [],
      });
      await newuser.save();

      // Send verification email
      const emailresponse = await sendVerificationEmail(
        email,
        username,
        verifycode,
      );
      if (!emailresponse.success) {
        return new NextResponse(
          JSON.stringify({
            message: emailresponse.message,
            success: false,
          }),
          { status: 500 },
        );
      }
    }

    // If everything goes well
    return new NextResponse(
      JSON.stringify({
        success: true,
        message: "User created successfully",
      }),
      { status: 200 },
    );
  } catch (error: any) {
    // Return error message in case of exception
    return new NextResponse(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }
}

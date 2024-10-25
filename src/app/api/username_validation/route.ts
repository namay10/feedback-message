import dbConect from "@/lib/dbconnect";
import UserModel from "@/models/User.model";
import { z } from "zod";
import { NextRequest, NextResponse } from "next/server";
import { usernnameValidation } from "@/schemas/signUp.schema";
const UsernameQuerySchema = z.object({
  username: usernnameValidation,
});

export async function GET(req: NextRequest) {
  await dbConect();

  try {
    const { searchParams } = new URL(req.url);
    const queryparam = {
      username: searchParams.get("username"),
    };
    //validate with zod
    const result = UsernameQuerySchema.safeParse(queryparam);
    if (!result.success) {
      const usernameerrors = result.error.format().username?._errors || [];
      return new NextResponse(
        JSON.stringify({
          message:
            usernameerrors?.length > 0
              ? usernameerrors.join(",")
              : "Invalid query parameter",
          success: false,
        }),
        { status: 400 },
      );
    }
    const { username } = result.data;
    const existingVerifiedUser = await UserModel.findOne({
      username,
      isverified: true,
    });
    if (existingVerifiedUser) {
      return new NextResponse(
        JSON.stringify({
          message: "Username is already taken",
          success: false,
        }),
        { status: 400 },
      );
    }
    return new NextResponse(
      JSON.stringify({
        message: "Username is available",
        success: true,
      }),
      { status: 200 },
    );
  } catch (error) {
    console.log("Error checking username", error);
    return new NextResponse(
      JSON.stringify({
        message: "Error checking username",
        success: false,
      }),
      { status: 500 },
    );
  }
}

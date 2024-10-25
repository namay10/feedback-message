import { getServerSession } from "next-auth";
import { authoptions } from "@/app/api/auth/[...nextauth]/options";
import dbConect from "@/lib/dbconnect";
import UserModel from "@/models/User.model";
import { User } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(
  req: NextRequest,
  { params }: { params: { messageid: string } },
) {
  const messageid = params.messageid;
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
  try {
    const updatedresult = await UserModel.updateOne(
      { _id: user._id },
      { $pull: { messages: { _id: messageid } } },
    );
    if (updatedresult.modifiedCount == 0) {
      return new NextResponse(
        JSON.stringify({
          message: "message not found",
          success: false,
        }),
        { status: 404 },
      );
    }
    return new NextResponse(
      JSON.stringify({
        message: "message deleted successfully",
        success: true,
      }),
      { status: 200 },
    );
  } catch (err) {
    return new NextResponse(
      JSON.stringify({
        message: "An error occurred while deleting the message",
        success: false,
      }),
      { status: 500 },
    );
  }
}

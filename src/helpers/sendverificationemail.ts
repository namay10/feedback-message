import { resend } from "@/lib/resend";
import VerificationEmail from "../../email/emailtemplate";
import { ApiResponse } from "@/types/ApiResponse";

export async function sendVerificationEmail(
  email: string,
  username: string,
  verifycode: string,
): Promise<ApiResponse> {
  try {
    const { data, error } = await resend.emails.send({
      from: "onboarding@resend.dev",
      to: email,
      subject: "Verification Code Feedback",
      react: VerificationEmail({ username, otp: verifycode }),
    });
    return { success: true, message: "Verification Email sent successfully" };
  } catch (emailerror: any) {
    throw new Error(emailerror);
  }
}

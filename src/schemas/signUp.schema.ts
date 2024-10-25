import { z } from "zod";
export const usernnameValidation = z
  .string()
  .min(3, "username must be atleast 3 characters long")
  .max(20, "username must be atmost 20 characters long");

export const userSignUpSchema = z.object({
  username: usernnameValidation,
  email: z.string().email("Invalid email address"),
  password: z
    .string()
    .min(6, "password must be atleast 6 characters long")
    .max(20, "password must be atmost 20 characters long")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d!@#$%^&*()_+=[\]{};':"\\|,.<>/?]{6,20}$/,
      "password must contain atleast one uppercase, one lowercase and one number",
    ),
});

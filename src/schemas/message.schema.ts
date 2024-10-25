import { z } from "zod";
export const messageSchema = z.object({
  message: z
    .string()
    .min(1, "Message can't be empty")
    .max(300, "Message can't exceed 300 characters"),
});

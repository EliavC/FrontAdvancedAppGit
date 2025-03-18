import { z } from "zod";

export const profileSchema = z.object({
    username: z.string().min(2, "Username must be at least 2 characters"),
    email: z.string().email("Invalid email format"),
    password: z.string().min(1, "Password must be at least 1 character"),
    img: z
      .instanceof(FileList)
      .optional()
      .refine(
        (files) => !files || files.length === 0 || files[0]?.size <= 5 * 1024 * 1024,
        "Max file size is 5MB"
      ),
});

export type userValidSchema = z.infer<typeof profileSchema>;

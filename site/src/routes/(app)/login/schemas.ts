import { z } from "zod";
import { zfd } from "zod-form-data";

export const registerSchema = zfd.formData(
  z.object({
    email: z.string().email(),
    password: z.string().min(8),
    username: z.string().min(3),
  }),
);

export const loginSchema = zfd.formData(
  z.object({
    email: z.string().email(),
    password: z.string().min(8),
  }),
);

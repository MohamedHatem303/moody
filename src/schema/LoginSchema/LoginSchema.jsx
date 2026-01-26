import * as zod from "zod";

export const schemaLogin = zod.object({
  email: zod
    .string()
    .nonempty("Email is required")
    .regex(
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      "Invalid email format",
    ),

  password: zod
    .string()
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[#?!@$%^&*-]).{8,}$/,
      "Password must be at least 8 chars & contain uppercase, lowercase, number, and special character",
    ),
});

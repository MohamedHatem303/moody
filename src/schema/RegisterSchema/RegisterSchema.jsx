import * as zod from "zod";

export const schemaRegister = zod.object({
name: zod
    .string()
    .nonempty("Name is required")
    .min(3, "Name should be at least 3 characters long")
    .max(50, "Name should be at most 50 characters long"),

email: zod
    .string()
    .nonempty("Email is required")
    .regex(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,"Invalid email format"),

password: zod
    .string()
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[#?!@$%^&*-]).{8,}$/,"Password must be at least 8 chars & contain uppercase, lowercase, number, and special character"),

rePassword: zod.string().nonempty("Repassword is required"),

gender: zod.string().nonempty("Gender is required"),

dateOfBirth: zod.coerce.date().refine((date) => {
    const year = date.getFullYear();
    const currentYear = new Date().getFullYear();
    const userAge = currentYear - year;
    return userAge >= 18;},{message: "Age must be at least 18 years old",}),})
.refine((data) => data.password === data.rePassword, {
    path: ["rePassword"],
    message: "Passwords do not match"});

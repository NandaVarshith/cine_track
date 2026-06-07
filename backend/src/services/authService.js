import bcrypt from "bcryptjs";
import { User } from "../models/user.js";

export async function register(name, email, rawPassword) {
  if (await User.exists({ email })) {
    throw new Error("Email already in use.");
  }

  const password = await bcrypt.hash(rawPassword, 10);
  return User.create({ name, email, password });
}

export async function authenticate(email, rawPassword) {
  const user = await User.findOne({ email });
  if (!user || !(await bcrypt.compare(rawPassword, user.password || ""))) {
    throw new Error("Invalid credentials.");
  }
  return user;
}

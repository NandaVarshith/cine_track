import bcrypt from "bcryptjs";
import { User } from "../models/user.js";

export async function getById(userId) {
  const user = await User.findById(userId);
  if (!user) {
    throw new Error("User not found.");
  }
  return user;
}

export async function updateProfile(userId, name, avatar, bio) {
  const user = await getById(userId);
  if (name?.trim()) {
    user.name = name;
  }
  if (avatar !== undefined) {
    user.avatar = avatar;
  }
  if (bio !== undefined) {
    user.bio = bio;
  }
  return user.save();
}

export async function changePassword(userId, currentPassword, newPassword) {
  const user = await getById(userId);
  if (!(await bcrypt.compare(currentPassword || "", user.password || ""))) {
    throw new Error("Current password is incorrect.");
  }
  user.password = await bcrypt.hash(newPassword, 10);
  await user.save();
}

export function safeUserPayload(user) {
  return {
    id: user.id,
    name: user.name || "",
    email: user.email || "",
    avatar: user.avatar || "",
    bio: user.bio || "",
  };
}

import { Schema, model, type InferSchemaType } from "mongoose";

const userSchema = new Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 80 },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    isAdmin: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
  },
  { versionKey: false },
);

export type UserDoc = InferSchemaType<typeof userSchema>;

export const UserModel = model("User", userSchema);

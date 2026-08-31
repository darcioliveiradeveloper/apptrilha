import { Schema, model, type InferSchemaType } from "mongoose";

const activationCodeSchema = new Schema(
  {
    code: { type: String, required: true, unique: true, uppercase: true, trim: true },
    usedBy: { type: String, default: null },
    usedAt: { type: Date, default: null },
    createdAt: { type: Date, default: Date.now },
  },
  { versionKey: false },
);

activationCodeSchema.index({ code: 1 }, { unique: true });

export type ActivationCodeDoc = InferSchemaType<typeof activationCodeSchema>;

export const ActivationCodeModel = model("ActivationCode", activationCodeSchema);

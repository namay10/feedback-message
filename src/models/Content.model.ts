import { Schema, Document } from "mongoose";

export interface message extends Document {
  content: string;
  createdAt: Date;
}

export const ContentSchema: Schema<message> = new Schema({
  content: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now,
  },
});

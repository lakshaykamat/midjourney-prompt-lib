import mongoose, { Schema } from 'mongoose';

const TagSchema = new Schema({
  name: String,
  url: String
}, { _id: true });

const PromptSchema = new Schema({
  url: String,
  title: String,
  prompt: String,
  tags: [TagSchema],
  images: {
    original: String,
    sizes: {
      type: Map,
      of: String
    }
  }
}, { timestamps: true });

export const Prompt = mongoose.model('Prompt', PromptSchema);
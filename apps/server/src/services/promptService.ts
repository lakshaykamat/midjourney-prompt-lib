import { Prompt } from "../models/Prompt";

export const getAllPrompts = async () => {
  const prompts = await Prompt.find();
  return prompts;
};

export const getPrompts = async (id: string) => {
  const prompts = await Prompt.findById(id);
  return prompts;
};

export const getsearchPrompt = async (query: string) => {
  // Case-insensitive search in title and prompt fields
  return await Prompt.find({
    $or: [
      { title: { $regex: query, $options: "i" } },
      { prompt: { $regex: query, $options: "i" } },
      { "tags.name": { $regex: query, $options: "i" } },
    ],
  }).limit(50);
};

export const getPromptsByTag = async (tag: string) => {
  return await Prompt.find({ "tags.name": tag });
};

export const getAllTags = async () => {
  const prompts = await Prompt.find({}, "tags");
  const tagMap = new Map<string, { tag: any; count: number }>();

  prompts.forEach((prompt) => {
    prompt.tags.forEach((tag) => {
      if (typeof tag.name === "string") {
        if (tagMap.has(tag.name)) {
          tagMap.get(tag.name)!.count += 1;
        } else {
          tagMap.set(tag.name, { tag, count: 1 });
        }
      }
    });
  });

  // Sort by count descending
  const sortedTags = Array.from(tagMap.values())
    .sort((a, b) => b.count - a.count)
    .map((entry) => entry.tag);

  return sortedTags;
};

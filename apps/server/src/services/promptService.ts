import { Prompt } from "../models/Prompt";

interface GetPromptsOptions {
  page?: number;
  limit?: number;
}

export const getAllPrompts = async ({ page = 1, limit = 30 }: GetPromptsOptions) => {
  const skip = (page - 1) * limit;

  const prompts = await Prompt.find()
    .sort({ _id: -1 }) // latest first
    .skip(skip)
    .limit(limit);

  const total = await Prompt.countDocuments();

  return {
    data: prompts,
    total,
    page,
    totalPages: Math.ceil(total / limit),
  };
};

export const getPrompts = async (id: string) => {
  return await Prompt.findById(id);
};

export const getsearchPrompt = async (query: string, page = 1, limit = 30) => {
  const skip = (page - 1) * limit;

  const filter = {
    $or: [
      { title: { $regex: query, $options: "i" } },
      { prompt: { $regex: query, $options: "i" } },
      { "tags.name": { $regex: query, $options: "i" } },
    ],
  };

  const data = await Prompt.find(filter)
    .sort({ _id: -1 })
    .skip(skip)
    .limit(limit);

  const total = await Prompt.countDocuments(filter);

  return {
    data,
    total,
    page,
    totalPages: Math.ceil(total / limit),
  };
};

export const getPromptsByTag = async (tag: string, page = 1, limit = 30) => {
  const skip = (page - 1) * limit;

  const filter = { "tags.name": tag };

  const data = await Prompt.find(filter)
    .sort({ _id: -1 })
    .skip(skip)
    .limit(limit);

  const total = await Prompt.countDocuments(filter);

  return {
    data,
    total,
    page,
    totalPages: Math.ceil(total / limit),
  };
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

  const sortedTags = Array.from(tagMap.values())
    .sort((a, b) => b.count - a.count)
    .map((entry) => entry.tag);

  return sortedTags;
};

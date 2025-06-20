import { Prompt } from '../models/Prompt';

export const getAllPrompts = async () => {
  const prompts = await Prompt.find()
  console.log(prompts)
  return prompts
};

export const getPromptsByTag = async (tag: string) => {
  return await Prompt.find({ 'tags.name': tag });
};

export const getAllTags = async () => {
  const prompts = await Prompt.find({}, 'tags');
  const tagMap = new Map();

  prompts.forEach(prompt => {
    prompt.tags.forEach(tag => {
      tagMap.set(tag.name, tag);
    });
  });

  return Array.from(tagMap.values());
};
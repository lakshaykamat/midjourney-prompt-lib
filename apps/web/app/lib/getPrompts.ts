import api from './api';
import { Tag } from './getTrendingTags';

export type Prompt = {
  slug: string;
  _id:string
  title: string;
  prompt: string;
  tags:Tag[];
  images: { original: string };
  url: string;
};

export const getPrompts = async (): Promise<Prompt[] | false> => {
  try {
    const data = await api.get('prompts').json<Prompt[]>();
    return data;
  } catch (err) {
    console.error('Failed to fetch prompts:', err);
    return false;
  }
};

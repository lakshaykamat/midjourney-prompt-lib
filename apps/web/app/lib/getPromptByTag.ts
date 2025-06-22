import api from './api';
import { Prompt } from './getPrompts';

export type Tag = {
    name:string,
    url:string,
    _id:string
}
export const getPromptByTag = async (name:string): Promise<Prompt[] | false> => {
  try {
    const data = await api.get(`prompts/tag/${name}`).json<any>();
    return data.data;
  } catch (err) {
    console.error('Failed to fetch prompts:', err);
    return false;
  }
};

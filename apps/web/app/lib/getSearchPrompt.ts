import api from './api';
import { Prompt } from './getPrompts';

export const getSearchPrompt = async (title:string): Promise<Prompt[] | false> => {
  try {
    const data = await api.get(`search/?q=${title}`).json<any>();
    return data.data;
  } catch (err) {
    console.error('Failed to fetch prompts:', err);
    return false;
  }
};

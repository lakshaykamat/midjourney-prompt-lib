import api from './api';
import { Prompt } from './getPrompts';

export const getPrompt = async (id:string): Promise<Prompt | false> => {
  try {
    const data = await api.get(`prompts/${id}`).json<Prompt>();
    return data;
  } catch (err) {
    console.error('Failed to fetch prompts:', err);
    return false;
  }
};

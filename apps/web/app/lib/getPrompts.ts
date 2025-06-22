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
export type ApiResponse = {
  data:Prompt[]
  total:number
  page:number
  totalPages:number
}
export const getPrompts = async (page?:number,limit?:number): Promise<ApiResponse | undefined> => {
  try {
    if(page && limit){
      const data = await api.get(`prompts?page=${page}&limit=${limit}`).json<ApiResponse>();
      return data;
    }
    const data = await api.get(`prompts`).json<ApiResponse>();
      return data;
  } catch (err) {
    console.error('Failed to fetch prompts:', err);
    return undefined;
  }
};

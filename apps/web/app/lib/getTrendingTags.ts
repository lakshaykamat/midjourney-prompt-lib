import api from './api';

export type Tag = {
    name:string,
    url:string,
    _id:string
}
export const getTrendingTags = async (): Promise<Tag[] | false> => {
  try {
    const data = await api.get('tags').json<Tag[]>();
    return data;
  } catch (err) {
    console.error('Failed to fetch prompts:', err);
    return false;
  }
};

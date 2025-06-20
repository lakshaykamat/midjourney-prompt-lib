import { Request, Response } from 'express';
import * as promptService from '../services/promptService';

export const getAllPrompts = async (req: Request, res: Response) => {
  const prompts = await promptService.getAllPrompts();
  res.json(prompts);
};

export const getPrompts = async (req: Request, res: Response) => {
  const { id } = req.params;
  const prompts = await promptService.getPrompts(id);
  res.json(prompts);
};

export const searchPrompt = async (req: Request, res: Response) => {
    const query = (req.query.q as string)?.trim();

    if (!query) {
      return 
      // return res.status(400).json({ message: "Search query is required." });
    }

    // Case-insensitive search in title and prompt fields
    const results = await promptService.getsearchPrompt(query)

    res.json(results);
};

export const getPromptsByTag = async (req: Request, res: Response) => {
  const { tag } = req.params;
  const prompts = await promptService.getPromptsByTag(tag);
  res.json(prompts);
};

export const getAllTags = async (_req: Request, res: Response) => {
  const tags = await promptService.getAllTags();
  res.json(tags);
};
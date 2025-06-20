import { Request, Response } from 'express';
import * as promptService from '../services/promptService';

export const getAllPrompts = async (req: Request, res: Response) => {
  const prompts = await promptService.getAllPrompts();
  res.json(prompts);
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
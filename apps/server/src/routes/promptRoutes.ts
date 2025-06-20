import { Router } from 'express';
import * as promptController from '../controllers/promptController';

const router = Router();

router.get('/prompts', promptController.getAllPrompts);
router.get('/prompts/tag/:tag', promptController.getPromptsByTag);
router.get('/tags', promptController.getAllTags);

export default router;
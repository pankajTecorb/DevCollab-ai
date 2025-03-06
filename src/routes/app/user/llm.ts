import StatusCodes from 'http-status-codes';
import { Request, Response, Router } from 'express';
import llmController from '@controllers/user/llm';
import { verifyAuthToken, checkRole } from "@utils/authValidator";




// Constants
const router = Router();
const { CREATED, OK } = StatusCodes;

// Paths
export const p = {
    llmchat:'/llm-chat',
    list:'/list'
 } as const;

/**
 * User Chat 
 */
router.post(p.llmchat,verifyAuthToken, checkRole(['user','Admin']), async (req: any, res: Response) => {
    const data = await llmController.groqChat(req.body,req.user.id);
    return res.status(OK).send({ data, code: CREATED});
});

/**
 * User Chat list
 */
router.get(p.list,verifyAuthToken, checkRole(['user','Admin']), async (req: any, res: Response) => {
    const data = await llmController.userChatList(req.query,req.user.id);
    return res.status(OK).send({ data, code: OK});
});
// Export default
export default router;

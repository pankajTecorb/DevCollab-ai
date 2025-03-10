import StatusCodes from 'http-status-codes';
import { Request, Response, Router } from 'express';
import dashboardController from '@controllers/admin/dashboard';
import { verifyAuthToken, checkRole } from "@utils/authValidator";




// Constants
const router = Router();
const { CREATED, OK } = StatusCodes;

// Paths
export const p = {
    dashboard: '/count',

} as const;


router.get(p.dashboard, verifyAuthToken, checkRole(['Admin', 'user']), async (req: any, res: Response) => {
    const data = await dashboardController.dashboard(req.user.id, req.headers);
    return res.status(OK).send({ data, code: OK });
});


// Export default
export default router;

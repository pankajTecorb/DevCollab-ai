import StatusCodes from 'http-status-codes';
import { Request, Response, Router } from 'express';

import userAuthController from '@controllers/user/auth';
import schemaValidator from '@utils/schemaValidator';
import { userSchema ,loginSchema,changePasswordSchema} from "@validators/admin"
import { verifyAuthToken, checkRole } from "@utils/authValidator";
import { success } from '@constants';



// Constants
const router = Router();
const { CREATED, OK } = StatusCodes;

// Paths
export const p = {
    update: '/update',
    login: '/login',
    detail: '/detail',
    logout: '/logout',
    changePass:'/password-change'

} as const;


/**
 * Mark account Verified
 */
router.patch(p.update,verifyAuthToken, checkRole(['user']), schemaValidator(userSchema), async (req: any, res: Response) => {
    const data = await userAuthController.accountUpdate(req.body,req.user.id);
    return res.status(OK).send({ data, code: OK});
});

/**
 * User Login
 */
router.post(p.login, schemaValidator(loginSchema), async (req: Request, res: Response) => {
    const data = await userAuthController.login(req.body, req.headers);
    return res.status(OK).send({ data, code: OK, message: success.en.loginSuccessful });
});

/**
 * User Details
 */
router.get(p.detail,verifyAuthToken, checkRole(['user']), async (req: any, res: Response) => {
    const data = await userAuthController.accountDetail(req.user.id);
    return res.status(OK).send({ data, code: OK, message: success.en.respondSuccess });
});
/**
 * User Logout
 */
 router.get(p.logout,verifyAuthToken, checkRole(['user']), async (req: Request, res: Response) => {
    const data = await userAuthController.logOut(req.headers);
    return res.status(OK).send({ data, code: OK, message: success.en.logOutSuccessful });
});
/**
 * User Change Password
 */
router.patch(p.changePass,verifyAuthToken, checkRole(['user']),schemaValidator(changePasswordSchema), async (req: any, res: Response) => {
    const data = await userAuthController.changePassword(req.body,req.user.id);
    return res.status(OK).send({ data, code: OK, message: success.en.respondSuccess });
});
// Export default
export default router;

import StatusCodes from 'http-status-codes';
import { Request, Response, Router } from 'express';

import authController from '@controllers/admin/auth';
import schemaValidator from '@utils/schemaValidator';
import { signUpSchema, loginSchema, changePasswordSchema, updateSchema } from "@validators/admin";
import { verifyAuthToken, checkRole } from "@utils/authValidator";
import upload from '@utils/multer';



// Constants
const router = Router();
const { CREATED, OK } = StatusCodes;

// Paths
export const p = {
    register: '/signup',
    login: '/login',
    details:'/details',
    changePassword: '/change-password',
    update: '/update-profile',
    logout: '/logout'
} as const;

/**
 * Login & SignUp  Admin
 */
router.post(p.register, schemaValidator(signUpSchema), async (req: Request, res: Response) => {
    const data = await authController.registerAdmin(req.body);
    return res.status(CREATED).send({ data });
});
//***********Login******** */
router.post(p.login, schemaValidator(loginSchema), async (req: Request, res: Response) => {
    const data = await authController.login(req.body);
    return res.status(OK).send({ ...data, code: OK })
});
//***********Details******** */
router.get(p.details,verifyAuthToken, checkRole(['Admin','user']),async (req: any, res: Response) => {
    const data = await authController.adminGetDetails(req.user.id);
    return res.status(OK).send({ ...data, code: OK })
});
//**********Change Password*********** */
router.patch(p.changePassword, verifyAuthToken, checkRole(['Admin','user']), schemaValidator(changePasswordSchema), async (req: any, res: Response) => {
    const data = await authController.changePassword(req.body, req.user.id);
    return res.status(OK).send({ ...data, code: OK })
});

//**********Update Profile*********** */
router.patch(p.update, verifyAuthToken, checkRole(['Admin','user']), schemaValidator(updateSchema), async (req: any, res: Response) => {
    const data = await authController.updateProfile(req.body, req.user.id);
    return res.status(OK).send({ ...data, code: OK })
});
//**********Log Out*********** */
router.get(p.logout, verifyAuthToken, checkRole(['Admin','user']), async (req: any, res: Response) => {
    const data = await authController.logOut(req.user.id);
    return res.status(OK).send({ ...data, code: OK })
});

// Export default
export default router;

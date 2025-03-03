import StatusCodes from 'http-status-codes';
import { Request, Response, Router } from 'express';

import userController from '@controllers/admin/user';
import schemaValidator from '@utils/schemaValidator';
import { userSchema} from "@validators/admin";
import { verifyAuthToken, checkRole } from "@utils/authValidator";
import upload from '@utils/multer';



// Constants
const router = Router();
const { CREATED, OK } = StatusCodes;

// Paths
export const p = {
    register: '/registor',
    update: '/update/:id',
    details: '/detail/:id',
    deleteUser: '/delete-user/:id',
    statusUser: '/status-user/:id',
    list: '/list'
} as const;

/**
 * User Registor
 */
router.post(p.register, verifyAuthToken,checkRole(['Admin']),schemaValidator(userSchema), async (req: Request, res: Response) => {
    const data = await userController.registerUser(req.body);
    return res.status(CREATED).send({ data });
});
//***********Update******** */
router.patch(p.update,verifyAuthToken,checkRole(['Admin']), schemaValidator(userSchema), async (req: Request, res: Response) => {
    const data = await userController.updateProfile(req.body,req.params.id);
    return res.status(OK).send({ ...data, code: OK })
});
//***********Details******** */
router.get(p.details,verifyAuthToken,checkRole(['Admin']), async (req: Request, res: Response) => {
    const data = await userController.adminGetUserDetails(req.params.id);
    return res.status(OK).send({ ...data, code: OK })
});
//**********Delete User Password*********** */
router.get(p.deleteUser, verifyAuthToken, checkRole(['Admin']), async (req: any, res: Response) => {
    const data = await userController.adminDeleteUser(req.params.id);
    return res.status(OK).send({ ...data, code: OK })
});

//**********Status Change *********** */
router.patch(p.statusUser, verifyAuthToken, checkRole(['Admin']), async (req: any, res: Response) => {
    const data = await userController.adminUserStatus(req.body, req.params.id);
    return res.status(OK).send({ ...data, code: OK })
});
//**********List of User *********** */
router.get(p.list, verifyAuthToken, checkRole(['Admin']), async (req: any, res: Response) => {
    const data = await userController.adminUserList(req.query , req.user.id);
    return res.status(OK).send({ ...data, code: OK })
});

// Export default
export default router;

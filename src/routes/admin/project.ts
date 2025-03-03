import StatusCodes from 'http-status-codes';
import { Request, Response, Router } from 'express';

import projectController from '@controllers/admin/project';
import schemaValidator from '@utils/schemaValidator';
import { projectSchema} from "@validators/admin";
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
    deleteUser: '/delete-project/:id',
    statusUser: '/status-project/:id',
    list: '/list'
} as const;

/**
 * User Registor
 */
router.post(p.register, verifyAuthToken,checkRole(['Admin']),schemaValidator(projectSchema), async (req: Request, res: Response) => {
    const data = await projectController.registerProject(req.body);
    return res.status(CREATED).send({ data });
});
//***********Update******** */
router.patch(p.update,verifyAuthToken,checkRole(['Admin']), schemaValidator(projectSchema), async (req: Request, res: Response) => {
    const data = await projectController.updateProject(req.body,req.params.id);
    return res.status(OK).send({ ...data, code: OK })
});
//***********Details******** */
router.get(p.details,verifyAuthToken,checkRole(['Admin']), async (req: Request, res: Response) => {
    const data = await projectController.adminProjectDetail(req.params.id);
    return res.status(OK).send({ ...data, code: OK })
});
//**********Delete User Password*********** */
router.get(p.deleteUser, verifyAuthToken, checkRole(['Admin']), async (req: any, res: Response) => {
    const data = await projectController.adminDeleteProject(req.params.id);
    return res.status(OK).send({ ...data, code: OK })
});

//**********Status Change *********** */
router.patch(p.statusUser, verifyAuthToken, checkRole(['Admin']), async (req: any, res: Response) => {
    const data = await projectController.adminProjectStatus(req.body, req.params.id);
    return res.status(OK).send({ ...data, code: OK })
});
//**********List of User *********** */
router.get(p.list, verifyAuthToken, checkRole(['Admin']), async (req: any, res: Response) => {
    const data = await projectController.adminProjectList(req.query , req.user.id);
    return res.status(OK).send({ ...data, code: OK })
});

// Export default
export default router;

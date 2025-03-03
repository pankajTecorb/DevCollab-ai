import { Router } from 'express';
import authRouter from './auth';
import userRouter from './user';
import projectRouter from './project'


// Export the base-router
const adminbaseRouter = Router();

// Setup routers
adminbaseRouter.use('/auth', authRouter)
adminbaseRouter.use('/user', userRouter)
adminbaseRouter.use('/project',projectRouter)

// Export default.
export default adminbaseRouter;
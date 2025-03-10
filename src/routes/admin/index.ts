import { Router } from 'express';
import authRouter from './auth';
import userRouter from './user';
import projectRouter from './project';
import dashboardRoute from './dashboard';


// Export the base-router
const adminbaseRouter = Router();

// Setup routers
adminbaseRouter.use('/auth', authRouter)
adminbaseRouter.use('/user', userRouter)
adminbaseRouter.use('/project',projectRouter)
adminbaseRouter.use('/dashboard',dashboardRoute)

// Export default.
export default adminbaseRouter;
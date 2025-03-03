import { Router } from 'express';
import authRoute from './auth';



// Export the base-router

const baseRouter = Router();

// Setup routers
baseRouter.use('/auth', authRoute)


// Export default.
export default baseRouter;
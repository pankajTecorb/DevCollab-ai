import { Router } from 'express';
import authRoute from './auth';
import llmRoute from './llm';



// Export the base-router

const baseRouter = Router();

// Setup routers
baseRouter.use('/auth', authRoute);
baseRouter.use('/llm', llmRoute);


// Export default.
export default baseRouter;
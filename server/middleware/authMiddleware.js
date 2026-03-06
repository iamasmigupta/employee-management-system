import { requireAuth } from '@clerk/express';

// Protects routes — returns 401 if user is not authenticated via Clerk
const verifyUser = requireAuth();

export default verifyUser;

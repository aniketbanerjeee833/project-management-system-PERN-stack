import { Router } from "express";
import { asyncHandler }    from "../middlewares/asyncHandler";
import { validateRequest } from "../middlewares/validateRequest";
import {
  validateInviteController,
  acceptInviteController,
} from "../controllers/invitation/invitation.controller";
import { acceptInviteSchema } from "../validators/invitation.validator";

// mounted at /api/v1/invitations
const router = Router();

// GET /api/v1/invitations/:token
// Frontend calls this on page load to show
// "You're joining Acme Corp as Manager"
// No auth — user is not logged in yet
router.get(
  "/:token",
  asyncHandler(validateInviteController)
);

// POST /api/v1/invitations/:token/accept
// Called after user submits register or login form
// No auth — creates the session inside the handler
router.post(
  "/:token/accept",
  validateRequest(acceptInviteSchema),
  asyncHandler(acceptInviteController)
);

export default router;
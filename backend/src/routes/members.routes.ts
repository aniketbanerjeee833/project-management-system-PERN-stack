// src/routes/member.routes.ts
import { Router } from "express";
import { asyncHandler }    from "../middlewares/asyncHandler";
import { authenticate }    from "../middlewares/authenticate";
import {
  getMembersController,
  getPendingInvitesController,
  removeMemberController,
  changeMemberRoleController,
  getWorkspaceManagersController,
  getWorkspaceEmployeesController,
} from "../controllers/members/members.controller";
import { requireRole } from "../middlewares/requireRole";

const router = Router({ mergeParams: true });
// mergeParams: true → access :workspaceId from parent router

// GET  /workspaces/:workspaceId/members
router.get(  "/",                   authenticate,requireRole(["admin"]), asyncHandler(getMembersController));

router.get("/managers",  authenticate, requireRole(["admin"]),asyncHandler(getWorkspaceManagersController));
router.get("/employees", authenticate ,asyncHandler(getWorkspaceEmployeesController));

// GET  /workspaces/:workspaceId/members/pending
router.get(  "/pending",            authenticate,requireRole(["admin"]), asyncHandler(getPendingInvitesController));

// DELETE /workspaces/:workspaceId/members/:userId
router.delete("/:userId",           authenticate, asyncHandler(removeMemberController));

// PATCH  /workspaces/:workspaceId/members/:userId/role
router.patch( "/:userId/role",      authenticate, asyncHandler(changeMemberRoleController));

export default router;
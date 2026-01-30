// ! src/modules/users/user.route.ts

import { Router } from "express";
import { API_PREFIX, UserRoles } from "../../common";
import { getMultiAuthorizationMiddleware } from "../../core/app";
import { userProfileController } from "./user.controller";

const userProfileRouter: Router = Router();

const base = `${API_PREFIX}/user-profile`;

// ───────────────────────────────────────────────
// All user profile routes are PROTECTED
// ───────────────────────────────────────────────

// 1. Create user profile
// Allowed: admin or user (e.g., after registration)
userProfileRouter.post(
  `${base}/create`,
  getMultiAuthorizationMiddleware(UserRoles.admin, UserRoles.user),
  userProfileController.createUserProfile.bind(userProfileController)
);

// 2. Update user profile (partial update)
// Allowed: admin or the user themselves
userProfileRouter.post(
  `${base}/update/:user_id`,
  getMultiAuthorizationMiddleware(UserRoles.admin, UserRoles.user),
  userProfileController.updateUserProfile.bind(userProfileController)
);

// 3. Get profile by user ID (own profile or admin view)
// Allowed: admin or the user themselves
userProfileRouter.get(
  `${base}/:user_id`,
  getMultiAuthorizationMiddleware(UserRoles.admin, UserRoles.user),
  userProfileController.findUserProfileByUserId.bind(userProfileController)
);

// 4. Get profile by email (admin only)
// Allowed: admin only
userProfileRouter.get(
  `${base}/by-email/:email`,
  getMultiAuthorizationMiddleware(UserRoles.user),
  userProfileController.findUserProfileByEmail.bind(userProfileController)
);

// 5. Get profile by phone (admin only)
// Allowed: admin only
userProfileRouter.get(
  `${base}/by-phone/:phone`,
  getMultiAuthorizationMiddleware(UserRoles.admin),
  userProfileController.findUserProfileByPhone.bind(userProfileController)
);


export default userProfileRouter;
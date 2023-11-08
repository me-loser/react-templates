import express from "express";
import userCtrl from "../controllers/user.controller";
import authCtrl from "../controllers/auth.controller";
import runValidation from "../validators";
import authValidator from "../validators/auth.validator";

const router = express.Router();

router
  .route("/api/users")
  .get(userCtrl.list)
  .post(authValidator.userSignupValidator, runValidation, userCtrl.create);

// read only requires authentication but update and remove require both authentication and authorization
router
  .route("/api/users/:userId")
  .get(authCtrl.requireSignin, userCtrl.read)
  .put(authCtrl.requireSignin, authCtrl.hasAuthorization, userCtrl.update)
  .delete(authCtrl.requireSignin, authCtrl.hasAuthorization, userCtrl.remove);
router.route("/api/user/activate-account").post(userCtrl.activateAccount);
router
  .route("/api/user/forgot-password")
  .put(
    authValidator.forgotPasswordValidator,
    runValidation,
    userCtrl.forgotPassword
  );
router
  .route("/api/user/reset-password")
  .put(
    authValidator.resetPasswordValidator,
    runValidation,
    userCtrl.resetPassword
  );

router.param("userId", userCtrl.userById);
// The routes having parameter as userId will first execute the userById and then it will propogate controll to the next relevant controller function

export default router;

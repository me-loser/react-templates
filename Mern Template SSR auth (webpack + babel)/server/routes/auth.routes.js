import express from "express";
import authCtrl from "../controllers/auth.controller";
import runValidation from "../validators";
import authValidator from "../validators/auth.validator";

const router = express.Router();

router
  .route("/auth/signin")
  .post(authValidator.userSigninValidator, runValidation, authCtrl.signin);
router.route("/auth/signout").get(authCtrl.signout);
router
  .route("/auth/forgot-password")
  .put(
    authValidator.forgotPasswordValidator,
    runValidation,
    authCtrl.forgetPassword
  );
router
  .route("/auth/reset-password")
  .put(
    authValidator.resetPasswordValidator,
    runValidation,
    authCtrl.resetPassword
  );

export default router;

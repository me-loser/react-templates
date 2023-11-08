import express from "express";
import authCtrl from "../controllers/auth.controller";
import validatorCtrl from "../validators/auth.validator";
import runValidation from "../validators";

const router = express.Router();

router
  .route("/auth/signin")
  .post(validatorCtrl.userSigninValidator, runValidation, authCtrl.signin);
router.route("/auth/signout").get(authCtrl.signout);
router.route("/google-login").post(authCtrl.googleSignin);

export default router;

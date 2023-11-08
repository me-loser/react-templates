import express from "express";
import userCtrl from "../controllers/user.controller";
import authCtrl from "../controllers/auth.controller";
import authValidator from "../validators/auth.validator";
import runValidation from "../validators";

const router = express.Router();

router
  .route("/api/users")
  .get(userCtrl.list)
  .post(authValidator.userSignupValidator, runValidation, userCtrl.create);

router.route("/api/users/activate-account").post(userCtrl.activateAccount);

// read only requires authentication but update and remove require both authentication and authorization
router
  .route("/api/users/:userId")
  .get(authCtrl.requireSignin, userCtrl.read)
  .put(authCtrl.requireSignin, authCtrl.hasAuthorization, userCtrl.update)
  .delete(authCtrl.requireSignin, authCtrl.hasAuthorization, userCtrl.remove);

router.param("userId", userCtrl.userById);
// The routes having parameter as userId will first execute the userById and then it will propogate controll to the next relevant controller function

export default router;

import User from "../models/user.model";
import jwt from "jsonwebtoken";
import _ from "lodash";
import { expressjwt } from "express-jwt";
import config from "../../config/config";
import sgMail from "@sendgrid/mail";
sgMail.setApiKey(config.sendgridApiKey);

const signin = async (req, res) => {
  try {
    const user = await User.findOne({
      email: req.body.email,
    });
    if (!user)
      return res.status(401).json({
        error: "User Not found",
      });

    if (!user.authenticate(req.body.password)) {
      return res.status(401).send({
        error: "Email and password don't match.",
      });
    }

    const token = jwt.sign(
      {
        _id: user._id,
      },
      config.jwtSecret
    );
    res.cookie("t", token, {
      expire: new Date() + 9999,
    });

    return res.json({
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (err) {
    return res.status(401).json({
      error: "Could not sign in",
    });
  }
};
const signout = (req, res) => {
  res.clearCookie("t");
  return res.status(200).json({
    message: "signed out",
  });
};

// validating JWT Token and setting user's ID in an 'auth' key to the request Object
// protected routes will use requireSignin
const requireSignin = expressjwt({
  secret: config.jwtSecret,
  algorithms: ["HS256"],
  userProperty: "auth",
});
// to verify that the authenticated user is deleting or updating its own data only
const hasAuthorization = (req, res, next) => {
  const authorized = req.profile && req.auth && req.profile._id == req.auth._id;
  if (!authorized) {
    return res.status(403).json({
      error: "User is not authorized",
    });
  }
  next();
};

const forgetPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        error: "User Not Found!",
      });
    }
    const token = jwt.sign({ _id: user._id }, config.jwtResetPassword, {
      expiresIn: "10m",
    });
    await user.updateOne({ resetPasswordLink: token });
    const emailData = {
      from: config.emailFrom,
      to: email,
      subject: `Password Reset Link`,
      html: `
    <h1>Please use the following link to activate your account</h1>
    <p>${config.clientUrl}/auth/password/reset/${token}</p>
    <hr />
    <p>This email may contain sensitive information</p>
    <p>${config.clientUrl}</p>
    `,
    };
    sgMail
      .send(emailData)
      .then((sent) => {
        return res.json({
          message: `Email has been sent to ${email}. Follow the instructions to acitvate your account`,
        });
      })
      .catch((err) => {
        console.log(err);
        return res.json({
          message: err.message,
        });
      });
  } catch (err) {
    return res.status(401).json({
      error: `${err}`,
    });
  }
};

const resetPassword = async (req, res) => {
  const { resetPasswordLink, newPassword } = req.body;
  if (resetPasswordLink) {
    jwt.verify(
      resetPasswordLink,
      config.jwtResetPassword,
      async (err, decoded) => {
        if (err) {
          return res.status(401).json({
            error: "Link Expired. Please Singup again.",
          });
        }
        try {
          let user = await User.findOne({
            resetPasswordLink: resetPasswordLink,
          });
          const updatedFields = {
            password: newPassword,
            resetPasswordLink: "",
          };
          user = _.extend(user, updatedFields);
          await user.save();
          return res.json({
            message: `Great! Now you can login with your new password`,
          });
        } catch (err) {
          res.status(401).json({
            error: "Unable to reset your password!",
          });
        }
      }
    );
  } else {
    return res.json({
      error: "Something went wrong. Try again!",
    });
  }
};

export default {
  signin,
  signout,
  requireSignin,
  hasAuthorization,
  forgetPassword,
  resetPassword,
};

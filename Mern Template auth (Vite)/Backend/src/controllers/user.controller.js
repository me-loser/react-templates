import User from "../models/user.model";
import errorHandler from "./../helpers/dbErrorHandler";
import config from "../../config/config";
import _ from "lodash";
import formidable from "formidable";
import fs from "fs";
import jwt from "jsonwebtoken";
import sgMail from "@sendgrid/mail";
sgMail.setApiKey(config.sendgridApiKey);

// const create = async (req, res) => {
//   const user = new User(req.body);
//   try {
//     await user.save();
//     return res.status(200).json({
//       message: "Successfully signed up!",
//     });
//   } catch (err) {
//     return res.status(400).json({
//       error: errorHandler.getErrorMessage(err),
//     });
//   }
// };

// Using Email Confirmation
const create = async (req, res) => {
  const { name, email, password } = req.body;
  const user = await User.findOne({ email });
  if (user) {
    return res.status(400).json({
      error: "Email is taken",
    });
  }

  const token = jwt.sign(
    { name, email, password },
    config.jwtAccountActivation,
    { expiresIn: "10m" }
  );

  const emailData = {
    from: config.emailFrom,
    to: email,
    subject: `Account activation link`,
    html: `
    <h1>Please use the following link to activate your account</h1>
    <p>${config.clientUrl}/user/activate?token=${token}</p>
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
        error: err.message,
      });
    });
};
const activateAccount = async (req, res) => {
  const { token } = req.body;
  if (token) {
    jwt.verify(token, config.jwtAccountActivation, async (err, decoded) => {
      if (err) {
        return res.status(401).json({
          error: "Link Expired. Please Singup again.",
        });
      }
      const { name, email, password } = jwt.decode(token);
      try {
        const presentUser = await User.findOne({ email: email });
        if (presentUser) {
          return res.status(400).json({
            error: "User is already Active. Please Sign in.",
          });
        } else {
          const user = new User({ name, email, password });
          await user.save();
          return res.status(200).json({
            message: "Successfully signed up!",
          });
        }
      } catch (err) {
        console.log(err);
        return res.status(400).json({
          error: err.message,
        });
      }
    });
  } else {
    return res.json({
      message: "Something went wrong. Try again!",
    });
  }
};

const list = async (req, res) => {
  try {
    let users = await User.find().select("name email updated created");
    res.json(users);
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err),
    });
  }
};
const userById = async (req, res, next, id) => {
  try {
    let user = await User.findById(id);
    if (!user)
      return res.status(400).json({
        error: "User not found",
      });
    req.profile = user;
    next();
  } catch (err) {
    return res.status(400).json({
      error: "Could not retrieve user",
    });
  }
};
const read = (req, res) => {
  const user = req.profile;
  user.hashed_password = undefined;
  user.salt = undefined;
  return res.json(user);
};
const update = (req, res) => {
  let form = new formidable.IncomingForm();
  form.keepExtensions = true;
  form.multiples = false;
  form.parse(req, async (err, fields, files) => {
    if (err) {
      console.log(err);
      return res.status(400).json({
        error: "Photo could not be uploaded",
      });
    }
    let user = req.profile;
    user = _.extend(user, fields);
    user.updated = Date.now();
    if (files.photo) {
      user.photo.data = fs.readFileSync(files.photo.path);
      user.photo.contentType = files.photo.type;
    }
    try {
      await user.save();
      user.hashed_password = undefined;
      user.salt = undefined;
      res.json(user);
    } catch (err) {
      return res.status(400).json({
        error: errorHandler.getErrorMessage(err),
      });
    }
  });
};
const remove = async (req, res, next) => {
  try {
    let user = req.profile;
    await User.deleteOne({ hashed_password: user.hashed_password });
    user.hashed_password = undefined;
    user.salt = undefined;
    res.json(user);
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err),
    });
  }
};

const forgotPassword = async (req, res) => {
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
    <p>${config.clientUrl}/user/reset-password?token=${token}</p>
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
          error: err.message,
        });
      });
  } catch (err) {
    console.log(err);
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
  create,
  activateAccount,
  userById,
  read,
  list,
  remove,
  update,
  forgotPassword,
  resetPassword,
};

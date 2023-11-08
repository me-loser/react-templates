import User from "../models/user.model";
import formidable from "formidable";
import fs from "fs";
import errorHandler from "./../helpers/dbErrorHandler";
import config from "../../config/config";
import _, { extend } from "lodash";
import jwt from "jsonwebtoken";
import sgMail from "@sendgrid/mail";
sgMail.setApiKey(config.sendgridApiKey);
// const create = async (req, res) => {
//   const { name, email, password } = req.body;
//   const user = await User.findOne({ email });
//   if (user) {
//     return res.status(400).json({
//       error: "Email is taken",
//     });
//   }
//   const newUser = new User({ name, email, password });
//   try {
//     await newUser.save();
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
    <p>${config.clientUrl}/user/activate/${token}</p>
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
      const presentUser = new User.findOne({ email });
      if (presentUser) {
        return res.status(400).json({
          error: "User is already Active. Please Sign in.",
        });
      } else {
        const user = new User({ name, email, password });
        try {
          await user.save();
          return res.status(200).json({
            message: "Successfully signed up!",
          });
        } catch (err) {
          return res.status(400).json({
            error: errorHandler.getErrorMessage(err),
          });
        }
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
  req.profile.hashed_password = undefined;
  req.profile.salt = undefined;
  return res.json(req.profile);
};
const update = (req, res) => {
  let form = new formidable.IncomingForm();
  form.keepExtensions = true;
  form.parse(req, async (err, fields, files) => {
    if (err) {
      console.log(err);
      return res.status(400).json({
        error: "Photo could not be uploaded",
      });
    }
    let user = req.profile;
    user = extend(user, fields);
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

export default {
  create,
  activateAccount,
  userById,
  read,
  list,
  remove,
  update,
};

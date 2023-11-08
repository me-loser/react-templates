import User from "../models/user.model";
import jwt from "jsonwebtoken";
import { expressjwt } from "express-jwt";
import config from "../../config/config";
import { OAuth2Client } from "google-auth-library";

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
    console.log(err);
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

const client = new OAuth2Client(
  config.googleClientId,
  config.googleClientSecret,
  [config.clientUrl]
);
const googleSignin = async (req, res) => {
  const { code } = req.body;
  try {
    const tokens = await client.getToken(code);
    const response = await client.verifyIdToken({
      idToken: tokens.tokens.id_token,
      audience: config.googleClientId,
    });
    const { email_verified, name, email } = response.payload;
    if (email_verified) {
      const user = await User.findOne({ email });
      if (user) {
        const token = jwt.sign(
          {
            _id: user._id,
          },
          config.jwtSecret
        );
        return res.json({
          token,
          user: {
            _id: user._id,
            name: user.name,
            email: user.email,
          },
        });
      } else {
        const password = email + config.jwtSecret;
        const newUser = new User({ name, email, password });
        await newUser.save();
        const token = jwt.sign(
          {
            _id: newUser._id,
          },
          config.jwtSecret
        );
        return res.json({
          token,
          user: {
            _id: newUser._id,
            name: newUser.name,
            email: newUser.email,
          },
        });
      }
    } else {
      return res.json(400).json({
        error: "Email is Not verified. Try Again!",
      });
    }
  } catch (err) {
    console.log(err);
  }
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

export default {
  signin,
  signout,
  googleSignin,
  requireSignin,
  hasAuthorization,
};

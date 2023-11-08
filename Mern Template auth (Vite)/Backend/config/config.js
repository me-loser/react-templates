import dotenv from "dotenv";
dotenv.config();
const config = {
  env: process.env.NODE_ENV || "development",
  port: process.env.PORT || 3000,
  jwtSecret: process.env.JWT_SECRET || "YOUR_secret_key",
  jwtAccountActivation: process.env.JWT_ACCOUNT_ACTIVATION,
  jwtResetPassword: process.env.JWT_RESET_PASSWORD,
  sendgridApiKey: process.env.SENDGRID_API_KEY,
  emailFrom: process.env.EMAIL_FROM,
  emailTo: process.env.EMAIL_TO,
  clientUrl: process.env.CLIENT_URL,
  googleClientId: process.env.GOOGLE_CLIENT_ID,
  googleClientSecret: process.env.GOOGLE_CLIENT_SECRET,
  mongoUrl:
    process.env.MONGODB_URL ||
    process.env.MONGO_HOST ||
    "mongodb://" +
      (process.env.IP || "127.0.0.1") +
      ":" +
      (process.env.MONGO_PORT || "27017") +
      "/mern-project",
};
export default config;

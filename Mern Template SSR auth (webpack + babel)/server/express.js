import express from "express";
import path from "path";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import compress from "compression";
import cors from "cors";
import helmet from "helmet";
import Template from "./../template";
import userRoutes from "./routes/user.routes";
import authRoutes from "./routes/auth.routes";
import morgan from "morgan";

// modules for server side rendering
import React from "react";
import ReactDOMServer from "react-dom/server";
import MainRouter from "./../client/MainRouter";
import { StaticRouter } from "react-router-dom/server";

//end

//comment out before building for production
import devBundle from "./devBundle";

const CURRENT_WORKING_DIR = process.cwd();
const app = express();

//comment out before building for production
devBundle.compile(app);

// parse body params and attache them to req.body
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan());
app.use(cookieParser());
app.use(compress());
// secure apps by setting various HTTP headers
app.use(helmet());
// enable CORS - Cross Origin Resource Sharing
app.use(cors());

app.use("/dist", express.static(path.join(CURRENT_WORKING_DIR, "dist")));

// mount routes
app.use("/", userRoutes);
app.use("/", authRoutes);

app.get("*", (req, res) => {
  res.setHeader("Content-Security-Policy", "script-src 'self' 'unsafe-eval'");

  const context = {};
  const markup = ReactDOMServer.renderToString(
    <StaticRouter location={req.url} context={context}>
      <MainRouter />
    </StaticRouter>
  );
  if (context.url) {
    return res.redirect(303, context.url);
  }
  res.status(200).send(
    Template({
      markup: markup,
    })
  );
});

// Catch unauthorised errors
app.use((err, req, res, next) => {
  if (err.name === "UnauthorizedError") {
    res.status(401).json({ error: err.name + ": " + err.message });
  } else if (err) {
    res.status(400).json({ error: err.name + ": " + err.message });
    console.log(err);
  }
});

export default app;

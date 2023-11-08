import express from "express";
import devBundle from "./devBundle";
import path from "path";
import template from "../template";
import { db } from "./db/db";

const CURRENT_WORKING_DIR = process.cwd();
let port = process.env.PORT || 3000;
const url = process.env.MONGODB_URL || "mongodb://localhost:27017/";
const app = express();
devBundle.compile(app);
app.use("/dist", express.static(path.join(CURRENT_WORKING_DIR, "dist")));
app.get("/", (req, res) => {
  res.status(200).send(template());
});

const start = async () => {
  await db.connect(url);
  app.listen(port, function onStart(err) {
    if (err) {
      console.log(err);
    }
    console.info("Server started onpost %s.", port);
  });
};
start();

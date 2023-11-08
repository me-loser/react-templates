import express from "express";
import { routes } from "./routes";

const app = express();

// body-parser can also be used instead of below two lines
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

routes.forEach((route) => app[route.method](route.path, route.handler));

app.listen(8080, () => {
  console.log("Server is listening on Port 8080");
});

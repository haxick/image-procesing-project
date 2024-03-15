import express, { Express } from "express";
import imageRouter from "./src/routes/imageRoutes";
import path from "path";
const app: Express = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set("views", path.join(__dirname, "src/views"));
app.set("view engine", "ejs");
app.use("/api", imageRouter);

export default app;

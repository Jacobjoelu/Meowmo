import express, { urlencoded } from "express";
import mongoose from "mongoose";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import cookieparser from "cookie-parser";
import userroutes from "./routes/user.routes.js";
import authMiddleware from "./middleware/auth.middleware.js";
import bodyParser from "body-parser";

//declarations
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
const port = process.env.PORT || 3000;
const projectRoot=path.join(__dirname,"..");
dotenv.config();

//middleware
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(projectRoot, "public")));
app.use(cookieparser());
app.use("/", userroutes);

//mongoose
mongoose
  .connect(
    `mongodb+srv://${process.env.DB_USERNAME}:${process.env.PWORD}@meowmol.bhstbmo.mongodb.net/?retryWrites=true&w=majority&appName=Meowmol`
  )
  .then(() => console.log(`MongoDB connected succesfully`))
  .catch((err) => console.error(err));

//server routes
app.get("/", authMiddleware.requireAuth, (req, res) => {
  res.sendFile(path.join(__dirname, "public", "random.html"));
});
app.get("*", authMiddleware.checkUser);

//port
app.listen(port, () => {
  console.log(`Server started at ${port}`);
});

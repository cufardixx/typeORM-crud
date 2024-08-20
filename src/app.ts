import express from "express";
import morgan from "morgan";
import cors from "cors";
import userRoute from "./User/user.routes"

const app = express();

app.use(cors());
app.use(morgan("dev"));
app.use(express.json());

app.use(userRoute)

export default app;
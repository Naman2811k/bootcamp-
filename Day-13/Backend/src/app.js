import 'dotenv/config'
import express from "express";
import authRouter from "./routes/auth.route.js";
import cookieParser from "cookie-parser";
import cors from 'cors'

const app = express();

export const data = []

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors({
    origin:process.env.FRONTEND_URI || 'http://localhost:5173',
    credentials:true
}))

app.get("/", (req,res)=>{
    return res.status(200).json({
        message: "Health Check"
    })
})

app.use("/api/auth", authRouter);

export default app;

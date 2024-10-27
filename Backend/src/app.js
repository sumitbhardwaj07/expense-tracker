import express from "express";
import cors from "cors"
import cookieParser from "cookie-parser";




const app = express();

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))

app.use(express.json({limit:"16kb"}))

app.use(express.urlencoded({
    extended:true,
    limit:"16kb"
}))

app.use(express.static("public"))
app.use(cookieParser())
//router declaration

import userRouter from './routes/user.router.js'
import expenseRouter from "./routes/expense.route.js"
import forgotpassRouter from "./routes/forgotpass.route.js"

app.use("/api/v1/expenses", expenseRouter)
app.use("/api/v1/users", userRouter)
app.use("/api/v1/forgotpass", forgotpassRouter )

// http://localhost:8000/api/v1/users/register

export {app}
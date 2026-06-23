import express from "express"
import dotenv from "dotenv";
import connectDB from "./config/connectDB.js";
import router from "./route/userRoute.js";
import cookieParser from "cookie-parser";
dotenv.config();

const PORT = process.env.PORT || 5000;
const app = express()

app.use(express.json())
// for send cookie without this not send token
app.use(cookieParser())
app.use("/api/auth",router)
app.listen(PORT, () => {
    connectDB()
  console.log(`Server running on port ${PORT}`);
});
import express from "express"
import dotenv from "dotenv";
import connectDB from "./config/connectDB.js";
import router from "./route/userRoute.js";
dotenv.config();

const PORT = process.env.PORT || 5000;
const app = express()

app.use(express.json())
app.use("/api",router)
app.listen(PORT, () => {
    connectDB()
  console.log(`Server running on port ${PORT}`);
});
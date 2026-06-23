import express from "express"
import { login, logout, register } from "../controller/userController.js"
import { isAuthenticated } from "../middlewares/isAuth.js"

const router = express.Router()


router.post("/register", register)
router.post("/login",isAuthenticated, login)
router.post("/logout", logout)



export default router
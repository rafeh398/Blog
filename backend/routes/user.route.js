    import express from "express"

    import { loginUser,registerUser,adminLogin ,logout,adminStatus, userStatus} from "../controllers/user.controller.js"
    import {verifyJWT} from "../middlewares/auth.middleware.js" 
    import {verifyAdminJWT} from "../middlewares/adminAuth.middleware.js"

    const userRouter=express.Router()

    userRouter.post("/register",registerUser)
    userRouter.post("/login",loginUser)
    userRouter.post("/logout", verifyJWT, logout) //verifyJWT is middleware
    userRouter.get("/status",verifyJWT,userStatus)



    userRouter.post("/admin/login",adminLogin)
    userRouter.get("/admin/status",verifyAdminJWT,adminStatus)
    userRouter.post("/admin/logout",verifyAdminJWT,logout)


    export  default userRouter

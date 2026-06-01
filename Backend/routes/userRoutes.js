import express from 'express';
import isAuth from '../middleware/isAuth.js';
import { getAdmin, getCurrentUser } from '../controller/userController.js';
import adminAuth from '../middleware/AdminAuth.js';


let userRoutes = express.Router()


userRoutes.get("/getcurrentuser",isAuth,getCurrentUser)
//admin route
userRoutes.get("/getadmin",adminAuth,getAdmin)

export default userRoutes
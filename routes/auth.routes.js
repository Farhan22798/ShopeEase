const { registerAdmin, loginAdmin, logoutAdmin, registerUser, loginUser, logoutUser } = require("../controllers/auth.controller")

const router=require("express").Router()

router 
.post("/admin/register",registerAdmin)
.post("/admin/login",loginAdmin)
.post("/admin/logout",logoutAdmin)
.post("/customer/register",registerUser)
.post("/customer/login",loginUser)
.post("/customer/logout",logoutUser)

module.exports=router
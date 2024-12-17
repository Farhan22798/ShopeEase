const { getAllProducts, addProduct, updateProduct, deleteProduct, fetchAdminOrders, adminUpdateOrderStatus, adminUserFetch, adminBlockUser, adminUnblockUser } = require("../controllers/admin.controller")

const router=require("express").Router()

router 
.get("/product",getAllProducts)
.get("/orders",fetchAdminOrders)
.get("/user/fetch",adminUserFetch)
.put("/order/update/:oid",adminUpdateOrderStatus)
.put("/user/block/:uid",adminBlockUser)
.put("/user/unblock/:uid",adminUnblockUser)
.post("/product/add",addProduct)
.put("/product/update/:productId",updateProduct)
.delete("/product/delete/:productId",deleteProduct)

module.exports=router
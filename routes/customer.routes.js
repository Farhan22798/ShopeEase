const { placeOrder, fetchCustomerOrders } = require("../controllers/customerController")


const router = require("express").Router()

router
    .post("/place-order", placeOrder)
    .get("/order-history",fetchCustomerOrders)


module.exports = router
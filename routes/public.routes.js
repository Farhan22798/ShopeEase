const { getKaroProductsforPublicview, getPublicProductDetails } = require("../controllers/public.controller")

const router = require("express").Router()

router
    .get("/product", getKaroProductsforPublicview)
    .get("/product-details/:productId", getPublicProductDetails)

module.exports = router
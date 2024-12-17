const mongoose = require("mongoose")

const ProductSchema = new mongoose.Schema({
    name: { type: String, required: true },
    price: { type: Number, required: true },
    desc: { type: String, required: true },
    hero: { type: [String], required: true },
    qty: { type: Number, required: true },
})

module.exports = mongoose.model("product", ProductSchema)
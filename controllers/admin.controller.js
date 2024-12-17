// product crud

const Product = require("../models/Product")
const path = require("path")
const { upload } = require("../utils/upload")
const Order = require("../models/Order")
const { sendemail } = require("../utils/email")
const User = require("../models/User")
require("dotenv").config()

const cloudinary = require("cloudinary").v2

cloudinary.config({
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME
})

exports.addProduct = async (req, res) => {
    upload(req, res, async err => {
        if (err) {
            console.log(err)
            return res.status(400).json({ message: "unable to upload" })
        }
        if (req.files) {
            // const allImages = []
            // for (const item of req.files) {
            //     const { secure_url } = await cloudinary.uploader.upload(item.path)
            //     allImages.push(secure_url)
            // }
            // console.log(allImages)


            // promise all👇

            const allImages = []
            const heros = []
            for (const item of req.files) {
                allImages.push(cloudinary.uploader.upload(item.path))
            }
            const data = await Promise.all(allImages)
            for (const item of data) {
                heros.push(item.secure_url)
            }
            // promise all end 
            await Product.create({ ...req.body, hero: heros })
            res.json({ message: "product add success" })
        } else {
            res.status(400).json({ message: "hero image is required" })
        }
    })
}
exports.getAllProducts = async (req, res) => {
    const result = await Product.find()
    res.json({ message: "product fetch success", result })
}
exports.updateProduct = async (req, res) => {
    /*
        name:""
        hero:["img1","img2","img3","img4"]

        step 1 delete "img2","img3" cloudinary req.body.remove
        step 2 upload new iamge cloudinary  req.files
        step 3 update database findByIdAndUpdate()  hero:["img1","new iamge","img4"]
    */


    upload(req, res, async err => {
        try {

            const allImages = []
            if (req.files && req.files.length > 0) {
                for (const item of req.files) {
                    const { secure_url } = await cloudinary.uploader.upload(item.path)
                    allImages.push(secure_url)
                }
            }
            const oldProduct = await Product.findById(req.params.productId)
            if (req.body.remove) {
                const result = oldProduct.hero.filter(item => !req.body.remove.includes(req.body.remove))
                oldProduct.hero = result
                if (typeof req.body.remove === "string") {
                    await cloudinary.uploader.destroy(path.basename(req.body.remove, path.extname(item)))

                } else {
                    for (const item of req.body.remove) {
                        await cloudinary.uploader.destroy(path.basename(item, path.extname(item)))
                    }
                }
            }
            //change only data
            console.log("no image")
            await Product.findByIdAndUpdate(req.params.productId, { ...req.body, hero: [...oldProduct.hero, ...allImages] })

            res.json({ message: "product update success" })
        } catch (error) {
            console.log(error)
            res.status(400).json({ message: "something went wrong" })
        }
    })
}


exports.deleteProduct = async (req, res) => {
    const result = await Product.findById(req.params.productId)

    for (const item of result.hero) {
        const ext= path.extname(item)
        await cloudinary.uploader.destroy(path.basename(item, ext))

    }
    await Product.findByIdAndDelete(req.params.productId)
    res.json({ message: "product delete success" })
}

exports.fetchAdminOrders = async (req, res) => {
    const total = await Order.countDocuments()
    const { skip, limit } = req.query
    const result = await Order
        .find()
        .skip(skip)
        .limit(limit)
        .populate("customer", "name")
        .populate("products", "-__v")
    res.json({ message: "order fetch success", result, total })
}


exports.adminUpdateOrderStatus = async (req, res) => {
    await Order.findByIdAndUpdate(req.params.oid, { status: req.body.status })
    const x = await Order.findById(req.params.oid)
    const result = await User.findById(x.customer)
    if (req.body.status !== "placed") {
        await sendemail({ to: result.email, subject: "Your Order Status Update!", message: `Your Order Status Now : ${req.body.status}` })
    }
    res.json({ message: "order status update success", result })
}


exports.adminUserFetch = async (req, res) => {
    try {
        const total = await User.countDocuments()
        const { skip, limit } = req.query
        const result = await User.find().skip(skip).limit(limit)
        res.json({ message: "user fetch success", result, total })
    } catch (error) {
        console.log(error)
        res.status(400).json({ message: "unable to  fetch" })

    }
}

exports.adminBlockUser = async (req, res) => {
    try {
        await User.findByIdAndUpdate(req.params.uid, { isActive: false })
        res.json({ message: "user block success" })
    } catch (error) {
        console.log(error)
        res.status(400).json({ message: "unable to  block" })

    }
}


exports.adminUnblockUser = async (req, res) => {
    try {
        await User.findByIdAndUpdate(req.params.uid, { isActive: true })
        res.json({ message: "user unblock success" })
    } catch (error) {
        console.log(error)
        res.status(400).json({ message: "unable to  unblock" })

    }
}







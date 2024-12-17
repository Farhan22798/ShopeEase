const Order = require("../models/Order")
const Product = require("../models/Product")
const User = require("../models/User")
const { sendemail } = require("../utils/email")

exports.placeOrder = async (req, res) => {
    try {
        console.log(req.loggedInUser)
        const orderData = await Order.create({

            customer: req.loggedInUser,
            address: req.body.address,
            city: req.body.city,
            products: req.body.products,
            payment: req.body.payment,
        })
        const result = await User.findById(req.loggedInUser)

        const allProducts = await Product.find({ _id: { $in: req.body.products } })

        const subTotal = allProducts.reduce((sum, item) => sum + item.price, 0)
        const tax = 18 * subTotal / 100
        const shipping = 100
        const total = subTotal + tax + shipping



        await sendemail({
            to: result.email, subject: "Your Order Has Been Placed Successfully! 🎉",
            message: `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
      <h1 style="color: #007BFF;">Thank You for Your Order! 🛒</h1>
      <p>Hi ${result.name},</p>
      <p>We are excited to let you know that your order has been placed successfully! 🎉</p>
      <p>Here are the details of your order:</p>
      <table style="border-collapse: collapse; width: 100%; margin: 20px 0; font-size: 14px;">
        <thead>
          <tr>
            <th style="border: 1px solid #ddd; padding: 8px; text-align: left; background-color: #f2f2f2;">Item</th>
            <th style="border: 1px solid #ddd; padding: 8px; text-align: left; background-color: #f2f2f2;">Price</th>
          </tr>
        </thead>
        <tbody>
      ${allProducts.map(item => `
          <tr>
            <td style="border: 1px solid #ddd; padding: 8px;">${item.name}</td>
            <td style="border: 1px solid #ddd; padding: 8px;">₹${item.price}/-</td>
          </tr>
       `
            )
            .join('')
        }
            </tbody>
      </table>
    <p><strong>Order Total:</strong> ₹${total}/-</p>
    <p><strong>Order ID:</strong> ${orderData._id}</p>
      <p>You can expect your delivery by <strong>Tommorrow</strong>.</p>
      <p>
        <a href="https://www.shopease.com/orders/[OrderID]" 
           style="background-color: #007BFF; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">
          View Your Order
        </a>
      </p>
      <p>If you have any questions or need assistance, feel free to <a href="https://www.shopease.com/contact" style="color: #007BFF;">contact us</a>.</p>
      <p>Thank you for choosing <strong>ShopEase</strong>! We hope to serve you again soon.</p>
      <p><strong>The ShopEase Team</strong></p>
    </div>
  `,
        })
        res.json({ message: "order place success" })
    } catch (error) {
        console.log(error)
        res.status(400).json({ message: "unbale to place order" })
    }
}

exports.fetchCustomerOrders = async (req, res) => {
    try {
        const result = await Order
            .find({ customer: req.loggedInUser })
            .populate("customer", "_id name")
            .populate("products", "-qty -__v")
        res.json({ message: "order fetch success", result })
    } catch (error) {
        console.log(error)
        res.status(400).json({ message: "unbale to fetch order" })
    }
}
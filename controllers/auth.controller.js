const bcrypt = require("bcryptjs")
const Admin = require("../models/Admin")
const jwt = require("jsonwebtoken")
const User = require("../models/User")
const { sendemail } = require("../utils/email")


exports.registerAdmin = async (req, res) => {
    const { email, password } = req.body
    const result = await Admin.findOne({ email })
    if (result) {
        return res.status(409).json({ message: "email already registered" })
    }
    const hash = await bcrypt.hash(password, 10)

    await Admin.create({ ...req.body, password: hash })
    res.json({ message: "admin register success" })

}

exports.loginAdmin = async (req, res) => {
    const { email, password } = req.body
    const result = await Admin.findOne({ email })
    if (!result) {
        return res.status(401).json({ message: "invalid credentials email" })
    }
    const isVerify = await bcrypt.compare(password, result.password)

    if (!isVerify) {
        return res.status(401).json({ message: "invalid credentials pwd" })

    }

    const token = jwt.sign({ _id: result._id }, process.env.JWT_KEY)

    res.cookie("admin", token, {
        maxAge: 1000 * 60 * 60 * 24,
        httpOnly: true,
        //secure:true
    })

    res.json({
        message: "admin login success", result: {
            _id: result._id,
            name: result.name,
            email: result.email
        }
    })

    
}

exports.logoutAdmin = (req, res) => {
    res.clearCookie("admin")
    res.json({ message: "admin logout success" })
    
}

exports.registerUser = async (req, res) => {
    
    try {
        
        const { email, password } = req.body
        const result = await User.findOne({ email })
        if (result) {
        return res.status(409).json({ message: "email already registered" })
    }
    const hash = await bcrypt.hash(password, 10)
    
    await User.create({ ...req.body, password: hash })
    await sendemail({
        to: email,
        subject: "Welcome to ShopEase! ",
        message: `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
      <h1 style="color: #007BFF;">Welcome to ShopEase! 🎉</h1>
      <p>Hi ${req.body.name},</p>
      <p>Thank you for signing up with <strong>ShopEase</strong>—your one-stop shop for all your needs! We are thrilled to have you join our family of happy shoppers.</p>
      <p>Here is what you can look forward to:</p>
      <ul style="padding-left: 20px;">
        <li>✅ <strong>Wide Range of Products</strong>: From essentials to exclusive deals, we have got it all.</li>
        <li>✅ <strong>Unbeatable Prices</strong>: Great quality at the best prices.</li>
        <li>✅ <strong>Seamless Shopping Experience</strong>: Designed to make your life easier.</li>
      </ul>
      <p>Start exploring and grab your first deal today! 🌟</p>
      <p>
        <a href="https://www.shopease.com" style="background-color: #007BFF; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">
          Visit ShopEase Now
        </a>
      </p>
      <p>If you have any questions or need assistance, feel free to reach out to our customer support team.</p>
      <p>Welcome aboard and happy shopping!</p>
      <p><strong>The ShopEase Team</strong></p>
      <p><em>P.S. Keep an eye out for exclusive offers and discounts coming your way!</em></p>
    </div>
  `
    });
    
    res.json({ message: "User register success" })
    
    
    
} catch (error) {
    console.log(error)
    return res.status(409).json({ message: "Unable To Register" })

}


}

exports.loginUser = async (req, res) => {
    const { email, password } = req.body
    const result = await User.findOne({ email })
    if (!result) {
        return res.status(401).json({ message: "invalid credentials email" })
    }
    const isVerify = await bcrypt.compare(password, result.password)
    
    if (!isVerify) {
        return res.status(401).json({ message: "invalid credentials pwd" })

    }
    if (!result.isActive) {
        return res.status(401).json({message:"Account is Blocked "})
    }
    const token = jwt.sign({ _id: result._id }, process.env.JWT_KEY)

    res.cookie("user", token, {
        maxAge: 1000 * 60 * 60 * 24,
        httpOnly: true,
        //secure:true
    })

    res.json({
        message: "user login success", result: {
            _id: result._id,
            name: result.name,
            email: result.email
        }
    })


}

exports.logoutUser = (req, res) => {
    res.clearCookie("user")
    res.json({ message: "user logout success" })

}


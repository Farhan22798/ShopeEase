const express = require("express")
const path = require("path")
const cookieParser = require("cookie-parser")
const mongoose = require("mongoose")
const { adminProtected, customerProtected } = require("./middlewares/protected.middleware")
require("dotenv").config()
const cors = require("cors")


const app = express()
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}))
app.use(express.json())
app.use(cookieParser())
app.use(express.static("dist"))

app.use("/api/admin", adminProtected, require("./routes/admin.routes"))
app.use("/api/auth", require("./routes/auth.routes"))
app.use("/api/public", require("./routes/public.routes"))
app.use("/api/customer", customerProtected, require("./routes/customer.routes"))

app.use("*", (req, res) => {
    res.sendFile(path.join(__dirname, "dist", "index.html"))
    //res.status(404).json({message: "Resource not found"})
})

mongoose.connect(process.env.MONGO_URL)

mongoose.connection.once("open", () => {
    console.log("MONGO CONNECTED")
    app.listen(process.env.PORT, console.log("SERVER RUNNING"))
})


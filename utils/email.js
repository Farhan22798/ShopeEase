const nodemailer = require("nodemailer")
require("dotenv").config()

exports.sendemail = ({ to, subject, message }) => {
    new Promise((resolve, reject) => {
        try {
            const mailer = nodemailer.createTransport({
                service: "gmail",
                auth: {
                    user: process.env.FROM_EMAIL,
                    pass: process.env.EMAIL_PASS
                }
            })
            mailer.sendMail({ to, subject, html: message }, (err) => {
                if (err) {
                    console.log(err)
                    reject("Nodemailer Error")
                }else{
                    console.log("Email Send Success")
                    resolve("Email Sent Succesfully")
                }
             })
        } catch (error) {
            console.log(error)
            reject("Unknown Error, Unable to send Mail")
        }
    })
}
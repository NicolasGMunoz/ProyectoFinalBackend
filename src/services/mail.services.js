import nodemailer from "nodemailer"
import configs from "../config.js"

const transporter = nodemailer.createTransport({
  service: "gmail",
  port: 587,
  auth: {
    user: configs.userNodeMailer, 
    pass: configs.passwordNodeMailer 
  }
})


export const sendEmail = async (email) => {
  const result = await transporter.sendMail({
    from: "CoderHouse 55660",
    to: email.to,
    subject: email.subject,
    html: email.html
  })

  return result
}
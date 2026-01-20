const nodemailer=require("nodemailer")

const transport=nodemailer.createTransport({
service:"Gmail",
  auth: {
    user: process.env.MAIL_ID,
    pass: process.env.MAIL_PASS,}
})

const sendOtpEmail=async ({to,otp,sub})=>{
    await transport.sendMail({
        from:process.env.MAIL_ID,
        to,
        subject:sub,
        html:`<p>Your otp for password reset is <b>${otp}</b>. it expires in 5 minutes</p>`
    })
}

const sendDeliveryEmail=async ({to,otp,sub})=>{
    await transport.sendMail({
        from:process.env.MAIL_ID,
        to,
        subject:sub,
        html:`<p>Your otp for delivery is <b>${otp}</b>. it expires in 5 minutes</p>`
    })
}

module.exports={sendOtpEmail,sendDeliveryEmail}

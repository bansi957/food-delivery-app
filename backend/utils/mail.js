const {Resend}=require("resend")

const resend = new Resend(process.env.RESEND_API_KEY);
console.log("Resend API Key exists?", !!process.env.RESEND_API_KEY)

 const sendDeliveryEmail = async ({ to, otp,sub }) => {
  return resend.emails.send({
    from: "Zwiggy <onboarding@resend.dev>",
    to,
    subject:sub,
    html: `
      <h2>Delivery OTP</h2>
      <p>Your OTP is:</p>
      <h1>${otp}</h1>
      <p>This OTP expires in 5 minutes.</p>
    `,
  });
};
 const sendOtpEmail = async ({ to, otp,sub }) => {
  return resend.emails.send({
    from: "Zwiggy <onboarding@resend.dev>",
    to,
    subject:sub,
    html: `
      <h2>${sub}</h2>
      <h1>${otp}</h1>
      <p>Valid for 5 minutes</p>
    `,
  });
};

module.exports={sendOtpEmail,sendDeliveryEmail}

// const nodemailer=require("nodemailer")

// const transport=nodemailer.createTransport({
// service:"Gmail",
//   port: 465,
//   secure: true, // Use true for port 465, false for port 587
//   auth: {
//     user: process.env.MAIL_ID,
//     pass: process.env.MAIL_PASS,}
// })

// const sendOtpEmail=async ({to,otp,sub})=>{
//     await transport.sendMail({
//         from:process.env.MAIL_ID,
//         to,
//         subject:sub,
//         html:`<p>Your otp for password reset is <b>${otp}</b>. it expires in 5 minutes</p>`
//     })
// }

// const sendDeliveryEmail=async ({to,otp,sub})=>{
//     await transport.sendMail({
//         from:process.env.MAIL_ID,
//         to,
//         subject:sub,
//         html:`<p>Your otp for delivery is <b>${otp}</b>. it expires in 5 minutes</p>`
//     })
// }

// module.exports={sendOtpEmail,sendDeliveryEmail}


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
      <h2>Your Otp for ${sub}</h2>
      <h1>${otp}</h1>
      <p>Valid for 5 minutes</p>
    `,
  });
};

module.exports={sendOtpEmail,sendDeliveryEmail}

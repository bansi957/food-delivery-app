import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendDeliveryEmail = async ({ to, otp }) => {
  return resend.emails.send({
    from: "Zwiggy <onboarding@resend.dev>",
    to,
    subject: "Your Delivery OTP",
    html: `
      <h2>Delivery OTP</h2>
      <p>Your OTP is:</p>
      <h1>${otp}</h1>
      <p>This OTP expires in 5 minutes.</p>
    `,
  });
};

export const sendOtpEmail = async ({ to, otp }) => {
  return resend.emails.send({
    from: "Zwiggy <onboarding@resend.dev>",
    to,
    subject: "Password Reset OTP",
    html: `
      <h2>Password Reset</h2>
      <h1>${otp}</h1>
      <p>Valid for 5 minutes</p>
    `,
  });
};


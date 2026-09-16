require("dotenv").config();
const { Router } = require("express");
const { createTransport } = require("nodemailer");
const { getUserByEmail } = require("../controller/user.controller");
const { hashPassword } = require("../utils/auth");
const { prisma } = require("../utils/connect");
const crypto = require("crypto");

const router = Router();

router.patch("/v1/api/forgotpassword", async (req, res) => {
  // #swagger.tags = ['PasswordReset']
  try {
    const { email } = await req.body;
    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const existingUser = await getUserByEmail(email);
    if (!existingUser) {
      return res.status(404).json({ message: "User not found!" });
    }

    // generate reset token
    const resetToken = crypto.randomBytes(20).toString("hex");
    const resetTokenExpiration = Date.now() + 3600000; // 1 hour

    // save reset token
    await prisma.user.update({
      where: { email },
      data: {
        reset_token: resetToken,
        reset_expiration: resetTokenExpiration.toString(),
      },
    });

    // send reset token to the user
    const transporter = createTransport({
      host: process.env.SMTP_HOST,
      port: 587,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
    });
    const mailOptions = {
      from: `"KodasHub" <${process.env.SMTP_USER}>`,
      to: email,
      subject: `Password Reset Request`,
      html: `
      <p>Hi,</p>

      <p>You requested a password reset. Please click the following link to reset your password: <a href="${process.env.FRONTEND_URI}/resetpassword/${resetToken}">Reset password</a></p>

      <p>It will expire within an hour. If you did not request this, please ignore this email.</p>

      <p>Warm regards,</p>

      <p><b>KodasHub Support</b></p>
      `,
    };

    await transporter.sendMail(mailOptions);
    return res.status(200).json({
      message: "Reset token generated and sent successfully.",
      resetToken,
    });
  } catch (error) {
    return res.status(500).json({ message: "Error", error });
  }
});

router.patch("/v1/api/resetpassword/:token", async (req, res) => {
  // #swagger.tags = ['PasswordReset']
  try {
    const { password } = await req.body;
    const { token } = req.params;

    const existingUser = await prisma.user.findFirst({
      where: {
        reset_token: token,
        reset_expiration: { gt: Date.now().toString() },
      },
    });

    if (!existingUser) {
      return res.status(400).json({ message: "Invalid token!" });
    }

    const hashedPassword = await hashPassword(password);

    // save new password
    await prisma.user.update({
      where: { email: existingUser.email },
      data: {
        password: hashedPassword,
        reset_token: null,
        reset_expiration: null,
      },
    });

    return res.status(200).json({ message: "Password reset successfully." });
  } catch (error) {
    return res.status(500).json({ message: "Error", error });
  }
});

module.exports = router;

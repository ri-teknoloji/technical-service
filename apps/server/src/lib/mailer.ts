import { Logger } from "@nestjs/common";
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: 465,
  secure: true, // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

const verifyTransporter = async () => {
  await transporter.verify();
  Logger.log("Mail server is ready", "Mailer");
};
verifyTransporter();

export const sendEmail = async (to: string, subject: string, html: string) => {
  const info = await transporter.sendMail({
    from: `NO Reply <${process.env.SMTP_USER}>`,
    to,
    subject,
    html,
  });
  return info;
};

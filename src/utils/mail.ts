import * as nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.MAIL_LOGIN,
    pass: process.env.MAIL_PASS,
  },
});

export interface MailOptionsType {
  subject: string;
  html: string;
  to: string | null;
}

const mailOptions = (data: MailOptionsType) => ({
  from: process.env.NODEMAILER_MAIL,
  ...data,
  to: data.to === null ? process.env.NODEMAILER_MAIL : data.to,
});

export const sendMail = async (options: MailOptionsType, cb) =>
  transporter.sendMail(mailOptions(options), cb);

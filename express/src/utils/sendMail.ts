import nodemailer from "nodemailer";
import path from "path";
import ejs from "ejs";

interface MailOptions {
  email: string;
  subject: string;
  template: string;
  data: Record<string, any>;
}

export const sendMail = async (options: MailOptions): Promise<void> => {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST as string,
    port: Number(process.env.SMTP_PORT),
    service: process.env.SMTP_SERVICE as string,
    auth: {
      user: process.env.SMTP_MAIL as string,
      pass: process.env.SMTP_PASSWORD as string,
    },
  });

  const { email, subject, template, data } = options;
  const temPath = path.join( __dirname,"../mails", template);
  console.log({temPath})
  const html = await ejs.renderFile(temPath, data);

  const mailOption = {
    from: process.env.SMTP_MAIL as string,
    to: email,
    subject,
    html,
  };

  try {
    const info = await transporter.sendMail(mailOption);
    console.log("Email sent: " + info.response);
  } catch (error) {
    console.error(error);
  }
};

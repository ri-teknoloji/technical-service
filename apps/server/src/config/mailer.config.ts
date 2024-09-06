import { MailerOptions } from "@nestjs-modules/mailer";
import { EjsAdapter } from "@nestjs-modules/mailer/dist/adapters/ejs.adapter";

export const mailerConfig: MailerOptions = {
  transport: {
    host: process.env.SMTP_HOST,
    port: 465,
    secure: true,
    ignoreTLS: true,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  },
  defaults: {
    from: `"No Reply" <${process.env.SMTP_USER}>`,
  },
  preview: true,
  template: {
    dir: process.cwd() + "/templates/",
    adapter: new EjsAdapter(),
    options: {
      strict: true,
    },
  },
};

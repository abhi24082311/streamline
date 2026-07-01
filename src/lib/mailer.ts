import nodemailer from 'nodemailer'

/**
 * Reusable Gmail SMTP transporter.
 * Uses an App Password — NOT your regular Gmail password.
 *
 * Setup:
 *  1. Enable 2FA on your Google account.
 *  2. Go to: https://myaccount.google.com/apppasswords
 *  3. Create an app password for "Mail".
 *  4. Add to .env:
 *       GMAIL_USER=you@gmail.com
 *       GMAIL_APP_PASSWORD=xxxx xxxx xxxx xxxx
 */
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false, // TLS via STARTTLS
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
})

interface SendMailOptions {
  to: string
  subject: string
  html: string
}

export async function sendMail({ to, subject, html }: SendMailOptions) {
  const from = `Streamline <${process.env.GMAIL_USER}>`

  await transporter.sendMail({
    from,
    to,
    subject,
    html,
  })
}

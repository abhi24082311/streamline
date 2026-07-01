import { Resend } from 'resend'

// Initialize once — reused across requests (safe for server actions)
export const resend = new Resend(process.env.RESEND_API_KEY)

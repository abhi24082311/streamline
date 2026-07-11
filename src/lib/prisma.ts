import { PrismaClient } from "@prisma/client"
import { PrismaNeon } from "@prisma/adapter-neon"
import { neonConfig } from "@neondatabase/serverless"
import ws from "ws"

declare global {
  var prisma: PrismaClient | undefined
}

// WebSocket for the serverless driver in Node.js
neonConfig.webSocketConstructor = ws
// Cache the WebSocket connection between queries to avoid repeated handshakes
neonConfig.fetchConnectionCache = true

const connectionString = process.env.DATABASE_URL!
const adapter = new PrismaNeon({ connectionString })

export const client = globalThis.prisma || new PrismaClient({ adapter })

if (process.env.NODE_ENV !== "production") {
  globalThis.prisma = client
}

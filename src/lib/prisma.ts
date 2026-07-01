import { PrismaClient } from "@prisma/client"
import { PrismaNeon } from "@prisma/adapter-neon"
import { neonConfig } from "@neondatabase/serverless"
import ws from "ws"

declare global {
  var prisma: PrismaClient | undefined
}

// Use WebSocket transport instead of HTTP — establishes a persistent connection
// instead of making a full HTTP fetch per query (much faster for Node.js runtime)
neonConfig.webSocketConstructor = ws

const connectionString = process.env.DATABASE_URL!
const adapter = new PrismaNeon({ connectionString })

export const client = globalThis.prisma || new PrismaClient({ adapter })

if (process.env.NODE_ENV !== "production") {
  globalThis.prisma = client
}
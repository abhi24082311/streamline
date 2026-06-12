import { PrismaClient } from "@prisma/client"
import { PrismaNeon } from "@prisma/adapter-neon"

declare global {
  var prisma: PrismaClient | undefined
}

const connectionString = process.env.DATABASE_URL!
const adapter = new PrismaNeon({ connectionString })

export const client = globalThis.prisma || new PrismaClient({ adapter })

if (process.env.NODE_ENV !== "production") {
  globalThis.prisma = client
}
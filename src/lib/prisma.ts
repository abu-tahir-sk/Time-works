import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '@prisma/client'

// The Prisma query engine performs its own DNS resolution, which fails on some
// networks (direct DNS queries refused). The pg driver uses the OS resolver,
// so we route all connections through @prisma/adapter-pg instead.
const createPrismaClient = () =>
  new PrismaClient({
    adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }),
  })

const globalForPrisma = global as unknown as { prisma: PrismaClient }

export const prisma =
  globalForPrisma.prisma || createPrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

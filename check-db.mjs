import { PrismaClient } from "@prisma/client"
const prisma = new PrismaClient()

async function main() {
  const users = await prisma.user.findMany({ select: { id: true, email: true, name: true } })
  const companies = await prisma.company.findMany({ select: { id: true, name: true, ownerId: true } })
  const clients = await prisma.client.count()
  const invoices = await prisma.invoice.count()
  const quotations = await prisma.quotation.count()
  const agreements = await prisma.agreement.count()
  const expenses = await prisma.expense.count()
  console.log("DB Stats:", { users, companies, clients, invoices, quotations, agreements, expenses })
}

main().finally(() => prisma.$disconnect())

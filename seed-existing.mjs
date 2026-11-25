import { PrismaClient } from "@prisma/client"
const prisma = new PrismaClient()

async function main() {
  const users = await prisma.user.findMany({ select: { id: true, email: true } })
  console.log(`Found ${users.length} users in DB. Processing each company...`)

  for (const user of users) {
    const companies = await prisma.company.findMany({
      where: { ownerId: user.id }
    })

    for (const company of companies) {
      console.log(`Checking company: ${company.name} (${company.id}) for user ${user.email}`)

      // 1. Update company branding & banking defaults
      await prisma.company.update({
        where: { id: company.id },
        data: {
          name: "Times Works",
          address: "Times Works Tower, Suite 400, Redmond, WA 98052, USA",
          email: "billing@timesworks.com",
          phone: "+1 (800) 555-0199",
          website: "https://timesworks.com",
          logoUrl: "/logo-v3.jpg",
          taxId: "US-EIN-98-7654321",
          bankName: "JPMorgan Chase Bank, N.A.",
          accountName: "Times Works LLC",
          accountNumber: "987456123001",
          ifsc: "CHASUS33XXX",
          paymentMethod: "ACH / Wire / Corporate Card",
          paymentInstructions: "1. Remittance via ACH, Wire Transfer, or Corporate Card.\n2. Beneficiary: Times Works LLC\n3. Routing / SWIFT: CHASUS33XXX\n4. Please reference document number on all transfers.",
          defaultNotes: "Thank you for partnering with Times Works. We appreciate your business.",
          defaultTerms: "1. Payment is due within 15 calendar days of invoice date.\n2. Remittance via ACH / Wire or credit card.\n3. Late payments subject to 1.5% statutory monthly fee.",
        }
      })

      // 2. Ensure Clients
      let clients = await prisma.client.findMany({ where: { companyId: company.id } })
      if (clients.length === 0) {
        console.log(`Creating clients for company ${company.id}`)
        await prisma.client.createMany({
          data: [
            {
              companyId: company.id,
              name: "Acme Global Corporation",
              clientCompany: "Acme Enterprises",
              email: "procurement@acmeglobal.com",
              phone: "+1 (415) 890-1200",
              address: "100 Montgomery St, Suite 1800, San Francisco, CA 94104, USA",
              taxId: "US-EIN-94-2849102",
            },
            {
              companyId: company.id,
              name: "Apex Horizon Digital Ltd",
              clientCompany: "Apex Group",
              email: "billing@apexhorizon.io",
              phone: "+44 20 7946 0912",
              address: "30 St Mary Axe, City of London, London EC3A 8EP, United Kingdom",
              taxId: "GB-VAT-924810293",
            },
            {
              companyId: company.id,
              name: "Starlight Cloud Labs Inc",
              clientCompany: "Starlight Cloud",
              email: "finance@starlightcloud.tech",
              phone: "+1 (206) 555-0143",
              address: "400 Pine St, Seattle, WA 98101, USA",
              taxId: "US-EIN-91-3847291",
            },
          ]
        })
        clients = await prisma.client.findMany({ where: { companyId: company.id } })
      }

      const primaryClient = clients[0]
      const secondaryClient = clients[1] || primaryClient
      const tertiaryClient = clients[2] || primaryClient

      // 3. Ensure Invoices
      const invCount = await prisma.invoice.count({ where: { companyId: company.id } })
      if (invCount === 0 && primaryClient) {
        console.log(`Creating default invoices for company ${company.id}`)
        const now = new Date()
        await prisma.invoice.create({
          data: {
            companyId: company.id,
            clientId: primaryClient.id,
            invoiceNumber: "INV-2026-001",
            issueDate: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000),
            dueDate: new Date(now.getTime() + 8 * 24 * 60 * 60 * 1000),
            currency: "USD",
            status: "PAID",
            paymentTerms: "Net 15",
            subtotal: 3010,
            total: 3010,
            amountPaid: 3010,
            template: "professional",
            notes: "Thank you for partnering with Times Works. We appreciate your business.",
            terms: "1. Payment is due within 15 calendar days of invoice date.\n2. Remittance via ACH / Wire or credit card.\n3. Late payments subject to 1.5% statutory monthly fee.",
            items: {
              create: [
                {
                  description: "Enterprise Financial Operations & Cloud Invoicing",
                  quantity: 1,
                  unit: "Month",
                  unitPrice: 1250,
                  amount: 1250,
                  sortOrder: 0,
                },
                {
                  description: "Senior Financial Partner Consultation",
                  quantity: 8,
                  unit: "Hour",
                  unitPrice: 220,
                  amount: 1760,
                  sortOrder: 1,
                },
              ],
            },
          },
        })

        await prisma.invoice.create({
          data: {
            companyId: company.id,
            clientId: secondaryClient.id,
            invoiceNumber: "INV-2026-002",
            issueDate: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000),
            dueDate: new Date(now.getTime() + 13 * 24 * 60 * 60 * 1000),
            currency: "USD",
            status: "SENT",
            paymentTerms: "Net 15",
            subtotal: 4200,
            total: 4200,
            amountPaid: 0,
            template: "professional",
            notes: "Times Works enterprise consulting invoice.",
            terms: "1. Payment is due within 15 calendar days of invoice date.\n2. Remittance via ACH / Wire or credit card.",
            items: {
              create: [
                {
                  description: "Cloud Architecture Modernization & API Microservices",
                  quantity: 1,
                  unit: "Project",
                  unitPrice: 3200,
                  amount: 3200,
                  sortOrder: 0,
                },
                {
                  description: "Security Hardening & OAuth 2.1 Implementation",
                  quantity: 1,
                  unit: "Service",
                  unitPrice: 1000,
                  amount: 1000,
                  sortOrder: 1,
                },
              ],
            },
          },
        })
      }

      // 4. Ensure Quotations
      const quoteCount = await prisma.quotation.count({ where: { authorId: user.id } })
      if (quoteCount === 0 && primaryClient) {
        console.log(`Creating default quotations for user ${user.id}`)
        const now = new Date()
        await prisma.quotation.create({
          data: {
            quotationNumber: "QT-2026-9081",
            clientId: primaryClient.id,
            authorId: user.id,
            issueDate: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000),
            validUntil: new Date(now.getTime() + 25 * 24 * 60 * 60 * 1000),
            currency: "USD",
            status: "ACCEPTED",
            discountType: "PERCENTAGE",
            discountValue: 0,
            template: "professional",
            notes: "Times Works delivers enterprise document workflow infrastructure with a 99.99% uptime SLA.",
            terms: "1. Quotation is valid for 30 calendar days from issue date.\n2. 50% advance upon project authorization, 50% upon final acceptance milestone.\n3. Applicable statutory taxes extra as billed.",
            items: {
              create: [
                {
                  description: "Enterprise Digital Workflow Transformation",
                  quantity: 1,
                  unit: "Project",
                  unitPrice: 3500,
                  taxRate: 10,
                },
                {
                  description: "Custom Cloud API & Dynamics 365 Architecture",
                  quantity: 1,
                  unit: "System",
                  unitPrice: 1800,
                  taxRate: 10,
                },
                {
                  description: "Annual Priority SLA Maintenance & Support",
                  quantity: 1,
                  unit: "Year",
                  unitPrice: 700,
                  taxRate: 10,
                },
              ],
            },
          },
        })

        if (tertiaryClient) {
          await prisma.quotation.create({
            data: {
              quotationNumber: "QT-2026-9082",
              clientId: tertiaryClient.id,
              authorId: user.id,
              issueDate: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000),
              validUntil: new Date(now.getTime() + 29 * 24 * 60 * 60 * 1000),
              currency: "USD",
              status: "SENT",
              discountType: "PERCENTAGE",
              discountValue: 5,
              template: "professional",
              notes: "Custom quote tailored for Starlight Cloud Labs enterprise deployment.",
              terms: "1. Net 30 payment terms upon completion of milestones.\n2. Includes all software artifacts and deployment scripts.",
              items: {
                create: [
                  {
                    description: "Multi-Tenant Document Generation Engine",
                    quantity: 1,
                    unit: "Milestone",
                    unitPrice: 2800,
                    taxRate: 0,
                  },
                  {
                    description: "Cryptographic Audit Trail & Security Verification Module",
                    quantity: 1,
                    unit: "Module",
                    unitPrice: 1400,
                    taxRate: 0,
                  },
                ],
              },
            },
          })
        }
      }

      // 5. Ensure Agreements
      const agreeCount = await prisma.agreement.count({ where: { companyId: company.id } })
      if (agreeCount === 0 && primaryClient) {
        console.log(`Creating default agreements for company ${company.id}`)
        await prisma.agreement.create({
          data: {
            agreementNumber: "AGR-2026-501",
            title: "Master Services Agreement (MSA)",
            type: "MSA",
            companyId: company.id,
            clientId: primaryClient.id,
            authorId: user.id,
            status: "ACTIVE",
            value: 45000,
            currency: "USD",
            effectiveDate: new Date("2026-01-01"),
            expiryDate: new Date("2026-12-31"),
            paymentTerms: "Net 30 days upon invoice receipt",
            scope: "Times Works shall provide comprehensive cloud software engineering, enterprise billing integration, system maintenance, and dedicated technical advisory services under agreed service level standards.",
            clauses: "1. Services & Deliverables: Provider shall deliver consulting, design, and software engineering services as outlined in each Statement of Work (SOW).\n2. Compensation & Billing: Fees shall be invoiced according to each SOW and payable Net 30.\n3. Intellectual Property: All custom software and deliverables produced shall become the sole property of Client upon final payment.\n4. Confidentiality: Both parties agree to protect proprietary data and technical assets with reasonable care.\n5. Termination: Either party may terminate this agreement with 30 days written notice.",
            notes: "Primary corporate MSA governing ongoing cloud architecture and workflow engagements.",
          },
        })

        if (secondaryClient) {
          await prisma.agreement.create({
            data: {
              agreementNumber: "AGR-2026-502",
              title: "Mutual Non-Disclosure Agreement (NDA)",
              type: "NDA",
              companyId: company.id,
              clientId: secondaryClient.id,
              authorId: user.id,
              status: "ACTIVE",
              value: null,
              currency: "USD",
              effectiveDate: new Date("2026-01-15"),
              expiryDate: new Date("2028-01-15"),
              paymentTerms: "N/A",
              scope: "Mutual protection and restricted handling of confidential commercial information, financial models, client data, and proprietary software source code.",
              clauses: "1. Definition of Confidential Information: Non-public business, financial, technical, or trade secret information.\n2. Non-Disclosure Obligations: Recipient shall hold all Confidential Information in strict confidence and use it solely for evaluation of prospective business relationships.\n3. Term & Survival: Confidentiality obligations survive for two (2) years from disclosure.",
              notes: "Mutual NDA executed prior to integration discovery sessions.",
            },
          })
        }
      }

      // 6. Ensure Expenses
      const expCount = await prisma.expense.count({ where: { companyId: company.id } })
      if (expCount === 0) {
        console.log(`Creating default expenses for company ${company.id}`)
        const now = new Date()
        const defaultExpenses = [
          {
            companyId: company.id,
            userId: user.id,
            title: "AWS Cloud Infrastructure & Database Hosting",
            category: "SOFTWARE",
            amount: 480.0,
            currency: "USD",
            expenseDate: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000),
            paymentMethod: "CARD",
            status: "PAID",
            notes: "Production Aurora PostgreSQL & S3 storage cluster monthly billing",
          },
          {
            companyId: company.id,
            userId: user.id,
            title: "GitHub Enterprise & Copilot Business Seats",
            category: "SOFTWARE",
            amount: 210.0,
            currency: "USD",
            expenseDate: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000),
            paymentMethod: "CARD",
            status: "PAID",
            notes: "10 developer licenses & automated CI/CD runners",
          },
          {
            companyId: company.id,
            userId: user.id,
            title: "Corporate Legal & Accounting Retainer",
            category: "OPERATIONS",
            amount: 750.0,
            currency: "USD",
            expenseDate: new Date(now.getTime() - 12 * 24 * 60 * 60 * 1000),
            paymentMethod: "BANK_TRANSFER",
            status: "PAID",
            notes: "Monthly corporate filing, tax compliance & legal review",
          },
          {
            companyId: company.id,
            userId: user.id,
            title: "High-Speed Dedicated Fiber Internet & Office Utilities",
            category: "UTILITIES",
            amount: 165.0,
            currency: "USD",
            expenseDate: new Date(now.getTime() - 15 * 24 * 60 * 60 * 1000),
            paymentMethod: "BANK_TRANSFER",
            status: "PAID",
            notes: "Gigabit enterprise uplink & utilities",
          },
          {
            companyId: company.id,
            userId: user.id,
            title: "Team Productivity & Design Suite (Figma, Notion)",
            category: "SOFTWARE",
            amount: 140.0,
            currency: "USD",
            expenseDate: new Date(now.getTime() - 20 * 24 * 60 * 60 * 1000),
            paymentMethod: "CARD",
            status: "PAID",
            notes: "Workspace organization and collaboration tools",
          },
        ]

        for (const exp of defaultExpenses) {
          await prisma.expense.create({ data: exp })
        }
      }
    }
  }

  const finalStats = {
    clients: await prisma.client.count(),
    invoices: await prisma.invoice.count(),
    quotations: await prisma.quotation.count(),
    agreements: await prisma.agreement.count(),
    expenses: await prisma.expense.count(),
  }
  console.log("FINAL DB STATS:", finalStats)
}

main().finally(() => prisma.$disconnect())

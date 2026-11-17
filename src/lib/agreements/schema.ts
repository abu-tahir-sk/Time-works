import { z } from "zod"

export const AGREEMENT_TYPES = [
    { value: "SERVICE_AGREEMENT", label: "Service Agreement" },
    { value: "NDA", label: "Non-Disclosure Agreement (NDA)" },
    { value: "MSA", label: "Master Service Agreement" },
    { value: "CONTRACT", label: "Freelance / Contractor Contract" },
    { value: "PARTNERSHIP", label: "Partnership Agreement" },
    { value: "CUSTOM", label: "Custom Agreement" },
] as const

export type AgreementType = (typeof AGREEMENT_TYPES)[number]["value"]

export const agreementSchema = z.object({
    title: z.string().min(1, "Title is required"),
    agreementNumber: z.string().min(1, "Agreement number is required"),
    type: z.enum(["SERVICE_AGREEMENT", "NDA", "MSA", "CONTRACT", "PARTNERSHIP", "CUSTOM"]),
    clientId: z.string().optional().default(""),
    clientName: z.string().min(1, "Client name is required"),
    clientEmail: z.string().email("Invalid email").or(z.literal("")).default(""),
    clientAddress: z.string().optional().default(""),
    clientCompany: z.string().optional().default(""),
    effectiveDate: z.string().min(1, "Effective date is required"),
    expiryDate: z.string().min(1, "Expiry date is required"),
    value: z.string().optional().default(""),
    currency: z.string().default("INR"),
    paymentTerms: z.string().optional().default(""),
    scope: z.string().optional().default(""),
    clauses: z.string().optional().default(""),
    notes: z.string().optional().default(""),
    companyDetails: z
        .object({
            name: z.string().default(""),
            address: z.string().default(""),
            email: z.string().default(""),
            phone: z.string().default(""),
            taxId: z.string().default(""),
            logoUrl: z.string().default(""),
        })
        .default({ name: "", address: "", email: "", phone: "", taxId: "", logoUrl: "" }),
})

export type AgreementFormValues = z.infer<typeof agreementSchema>

export const DEFAULT_CLAUSES_BY_TYPE: Record<AgreementType, string> = {
    SERVICE_AGREEMENT:
        "1. SCOPE OF WORK\nThe Service Provider shall perform the services described in the scope of work with reasonable skill, care, and diligence.\n\n2. TERM\nThis Agreement shall commence on the Effective Date and remain in force until the Expiry Date, unless terminated earlier in accordance with the terms herein.\n\n3. PAYMENT TERMS\nThe Client shall pay the Service Provider the agreed fees as stated, in accordance with the payment schedule set out in this Agreement.\n\n4. INTELLECTUAL PROPERTY\nAll deliverables and intellectual property created under this Agreement shall vest in the Client upon full and final payment.\n\n5. CONFIDENTIALITY\nEach party shall keep confidential all information received from the other party and shall not disclose it to any third party without prior written consent.\n\n6. TERMINATION\nEither party may terminate this Agreement with thirty (30) days' prior written notice. All amounts due up to the termination date shall remain payable.\n\n7. GOVERNING LAW\nThis Agreement shall be governed by and construed in accordance with the laws applicable in the jurisdiction of the Service Provider.",
    NDA:
        "1. DEFINITION OF CONFIDENTIAL INFORMATION\n\"Confidential Information\" means any non-public information disclosed by one party to the other, whether orally, in writing, or electronically.\n\n2. OBLIGATIONS\nThe Receiving Party shall protect the Confidential Information with the same degree of care it uses to protect its own confidential information, and in no event less than reasonable care.\n\n3. EXCLUSIONS\nConfidential Information shall not include information that is or becomes publicly available, was already known to the Receiving Party, or is independently developed.\n\n4. TERM\nThe confidentiality obligations under this Agreement shall survive for three (3) years after the Expiry Date.\n\n5. GOVERNING LAW\nThis Agreement shall be governed by the laws applicable in the jurisdiction of the Disclosing Party.",
    MSA:
        "1. PURPOSE\nThis Master Service Agreement governs the provision of services by the Service Provider to the Client and shall take precedence over any conflicting purchase order or work order.\n\n2. STATEMENTS OF WORK\nIndividual Statements of Work (SOWs) shall reference this Agreement and shall be governed by its terms.\n\n3. FEES AND INVOICING\nFees shall be as stated in the applicable SOW. Invoices are payable within the period stated therein.\n\n4. LIMITATION OF LIABILITY\nNeither party shall be liable for indirect or consequential damages. Total liability shall not exceed the fees paid in the twelve (12) months preceding the claim.\n\n5. TERMINATION\nEither party may terminate this Agreement for material breach if such breach remains uncured thirty (30) days after written notice.",
    CONTRACT:
        "1. ENGAGEMENT\nThe Client engages the Contractor to provide the services described in the scope of work on the terms of this Contract.\n\n2. INDEPENDENT CONTRACTOR\nThe Contractor is an independent contractor and nothing in this Contract creates an employment, agency, or partnership relationship.\n\n3. FEES\nThe Client shall pay the Contractor the fees stated in this Contract within the agreed payment terms.\n\n4. REVISIONS AND DELIVERABLES\nDeliverables shall be provided per the agreed schedule. Up to two (2) rounds of revisions are included per deliverable unless otherwise agreed.\n\n5. TERMINATION\nEither party may terminate this Contract with fourteen (14) days' written notice. Work completed up to termination shall be invoiced pro-rata.",
    PARTNERSHIP:
        "1. PURPOSE\nThe parties agree to collaborate in the manner described in this Agreement for their mutual commercial benefit.\n\n2. RESPONSIBILITIES OF THE PARTIES\nEach party shall perform the responsibilities allocated to it under this Agreement with due care and professionalism.\n\n3. REVENUE SHARING\nRevenue derived from the partnership shall be shared in the proportions agreed in writing between the parties.\n\n4. NON-EXCLUSIVITY\nUnless agreed otherwise in writing, the partnership established herein is non-exclusive.\n\n5. TERM AND TERMINATION\nThis Agreement shall remain in force until the Expiry Date and may be terminated by either party with sixty (60) days' written notice.",
    CUSTOM: "",
}

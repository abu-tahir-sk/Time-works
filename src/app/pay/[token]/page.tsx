import { Metadata } from "next"
import { notFound } from "next/navigation"
import { getPublicPaymentLinkData } from "@/actions/project-payments"
import { PayGatewayClient } from "./pay-gateway-client"

export async function generateMetadata({ params }: { params: { token: string } }): Promise<Metadata> {
  const res = await getPublicPaymentLinkData(params.token)
  return {
    title: res.success && res.link ? `${res.link.title} | Times Works Gateway` : "Payment Checkout",
  }
}

export default async function PublicPayPage({ params }: { params: { token: string } }) {
  const res = await getPublicPaymentLinkData(params.token)

  if (!res.success || !res.link) {
    notFound()
  }

  return <PayGatewayClient linkData={res.link} />
}

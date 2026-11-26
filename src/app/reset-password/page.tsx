import { Metadata } from "next"
import { Suspense } from "react"
import { AuthLayout } from "@/components/auth/auth-layout"
import { ResetPasswordForm } from "@/components/auth/reset-password-form"

export const metadata: Metadata = {
  title: "Set New Password | Times Works",
  description: "Set your new Times Works password.",
}

export default function ResetPasswordPage() {
  return (
    <AuthLayout>
      <Suspense fallback={<div>Loading...</div>}>
        <ResetPasswordForm />
      </Suspense>
    </AuthLayout>
  )
}

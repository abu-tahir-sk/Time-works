"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { toast } from "sonner"
import { CheckCircle2, KeyRound, Loader2, Lock, ShieldAlert } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import { AuthCardHeader } from "./auth-card-header"
import { PasswordInput } from "./password-input"

const resetPasswordSchema = z.object({
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
})

type ResetPasswordValues = z.infer<typeof resetPasswordSchema>

export function ResetPasswordForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const searchParams = useSearchParams()
  const router = useRouter()
  const token = searchParams.get("token")

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  })

  async function onSubmit(data: ResetPasswordValues) {
    if (!token) {
      toast.error("Missing reset token")
      return
    }

    setIsLoading(true)

    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password: data.password }),
      })

      if (res.ok) {
        setIsSuccess(true)
        toast.success("Password updated successfully!")
        setTimeout(() => {
          router.push("/login")
        }, 2000)
      } else {
        const errorData = await res.json()
        toast.error(errorData.error || "Failed to reset password")
      }
    } catch (error) {
      toast.error("Something went wrong. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  if (!token) {
    return (
      <div className="w-full text-center">
        <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-red-500 text-white shadow-lg shadow-red-500/25">
          <ShieldAlert className="h-7 w-7" aria-hidden="true" />
        </div>
        <h1 className="text-xl font-semibold tracking-tight sm:text-2xl">Invalid link</h1>
        <p className="mt-1.5 text-sm text-muted-foreground">
          This password reset link is invalid or has expired.
        </p>
        <Link href="/forgot-password" className="mt-6 block">
          <Button className="h-10 w-full rounded-lg bg-[#c82020] text-sm font-semibold text-white shadow-sm shadow-[#c82020]/25 hover:bg-[#a81a1a]">
            Request new link
          </Button>
        </Link>
      </div>
    )
  }

  if (isSuccess) {
    return (
      <div className="w-full text-center">
        <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500 text-white shadow-lg shadow-emerald-500/25">
          <CheckCircle2 className="h-7 w-7" aria-hidden="true" />
        </div>
        <h1 className="text-xl font-semibold tracking-tight sm:text-2xl">Password reset</h1>
        <p className="mt-1.5 text-sm text-muted-foreground">
          Your password has been successfully updated. Redirecting to login...
        </p>
        <Loader2 className="mx-auto mt-6 h-5 w-5 animate-spin text-[#c82020] dark:text-rose-400" />
      </div>
    )
  }

  return (
    <div className="w-full">
      <AuthCardHeader
        icon={KeyRound}
        title="Set new password"
        description="Choose a strong password you haven't used before."
      />

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        <div className="space-y-1.5">
          <Label htmlFor="password" className="sr-only">
            New password
          </Label>
          <div className="relative">
            <Lock
              className="pointer-events-none absolute top-1/2 left-3 z-10 h-4 w-4 -translate-y-1/2 text-muted-foreground"
              aria-hidden="true"
            />
            <PasswordInput
              id="password"
              placeholder="New password"
              autoComplete="new-password"
              disabled={isLoading}
              {...register("password")}
              className={cn(
                "h-10 rounded-lg pl-9",
                errors.password && "border-red-500 focus-visible:ring-red-500"
              )}
            />
          </div>
          {errors.password && <p className="text-xs text-red-500">{errors.password.message}</p>}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="confirmPassword" className="sr-only">
            Confirm password
          </Label>
          <div className="relative">
            <Lock
              className="pointer-events-none absolute top-1/2 left-3 z-10 h-4 w-4 -translate-y-1/2 text-muted-foreground"
              aria-hidden="true"
            />
            <PasswordInput
              id="confirmPassword"
              placeholder="Confirm password"
              autoComplete="new-password"
              disabled={isLoading}
              {...register("confirmPassword")}
              className={cn(
                "h-10 rounded-lg pl-9",
                errors.confirmPassword && "border-red-500 focus-visible:ring-red-500"
              )}
            />
          </div>
          {errors.confirmPassword && (
            <p className="text-xs text-red-500">{errors.confirmPassword.message}</p>
          )}
        </div>

        <Button
          type="submit"
          disabled={isLoading}
          className="h-10 w-full rounded-lg bg-[#c82020] text-sm font-semibold text-white shadow-sm shadow-[#c82020]/25 hover:bg-[#a81a1a]"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Updating...
            </>
          ) : (
            "Update Password"
          )}
        </Button>
      </form>
    </div>
  )
}

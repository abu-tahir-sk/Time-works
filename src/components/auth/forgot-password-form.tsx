"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import Link from "next/link"
import { toast } from "sonner"
import { CheckCircle2, Loader2, Lock, Mail } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import { AuthCardHeader } from "./auth-card-header"

const forgotPasswordSchema = z.object({
  email: z.string().min(1, "Email is required").email("Please enter a valid email address"),
})

type ForgotPasswordValues = z.infer<typeof forgotPasswordSchema>

export function ForgotPasswordForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  })

  async function onSubmit(data: ForgotPasswordValues) {
    setIsLoading(true)

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      if (res.ok) {
        setIsSuccess(true)
        toast.success("Reset link sent to your email")
      } else {
        const errorData = await res.json()
        toast.error(errorData.error || "Failed to send reset link")
      }
    } catch (error) {
      toast.error("Something went wrong. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  if (isSuccess) {
    return (
      <div className="w-full text-center">
        <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500 text-white shadow-lg shadow-emerald-500/25">
          <CheckCircle2 className="h-7 w-7" aria-hidden="true" />
        </div>
        <h1 className="text-xl font-semibold tracking-tight sm:text-2xl">Check your email</h1>
        <p className="mt-1.5 text-sm text-muted-foreground">
          We&apos;ve sent a password reset link to your email address.
        </p>
        <Link href="/login" className="mt-6 block">
          <Button className="h-10 w-full rounded-lg bg-[#c82020] text-sm font-semibold text-white shadow-sm shadow-[#c82020]/25 hover:bg-[#a81a1a]">
            Back to login
          </Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="w-full">
      <AuthCardHeader
        icon={Lock}
        title="Forgot password?"
        description="Enter your email address and we'll send you a link to reset your password."
      />

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        <div className="space-y-1.5">
          <Label htmlFor="email" className="sr-only">
            Email address
          </Label>
          <div className="relative">
            <Mail
              className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground"
              aria-hidden="true"
            />
            <Input
              id="email"
              type="email"
              placeholder="Email address"
              autoCapitalize="none"
              autoComplete="email"
              autoCorrect="off"
              disabled={isLoading}
              {...register("email")}
              className={cn(
                "h-10 rounded-lg pl-9",
                errors.email && "border-red-500 focus-visible:ring-red-500"
              )}
            />
          </div>
          {errors.email && <p className="text-xs text-red-500">{errors.email.message}</p>}
        </div>

        <Button
          type="submit"
          disabled={isLoading}
          className="h-10 w-full rounded-lg bg-[#c82020] text-sm font-semibold text-white shadow-sm shadow-[#c82020]/25 hover:bg-[#a81a1a]"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Sending link...
            </>
          ) : (
            "Send Reset Link"
          )}
        </Button>
      </form>

      <div className="mt-6 text-center text-sm">
        <span className="text-muted-foreground">Remember your password? </span>
        <Link
          href="/login"
          className="font-semibold text-[#c82020] hover:underline dark:text-rose-400"
        >
          Back to login
        </Link>
      </div>
    </div>
  )
}

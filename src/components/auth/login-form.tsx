"use client"

import { useEffect, useState } from "react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import Link from "next/link"
import { toast } from "sonner"
import { Loader2, Lock, LogIn, Mail, ShieldCheck } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import { AuthCardHeader } from "./auth-card-header"
import { AuthDivider } from "./auth-divider"
import { GoogleButton } from "./google-button"
import { PasswordInput } from "./password-input"

const REMEMBERED_EMAIL_KEY = "timesworks:remembered-email"

const loginSchema = z.object({
  email: z.string().min(1, "Email is required").email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
  code: z.string().optional(),
})

type LoginFormValues = z.infer<typeof loginSchema>

export function LoginForm() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [showTwoFactor, setShowTwoFactor] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
    setValue,
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      code: "",
    },
  })

  // Restore a remembered email so the field is pre-filled next visit.
  useEffect(() => {
    try {
      const savedEmail = window.localStorage.getItem(REMEMBERED_EMAIL_KEY)
      if (savedEmail) {
        setValue("email", savedEmail)
        // Restoring from localStorage is a post-hydration sync with an external store.
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setRememberMe(true)
      }
    } catch {
      // localStorage can be unavailable (private mode); ignore.
    }
  }, [setValue])

  function persistRememberedEmail(email: string) {
    try {
      if (rememberMe) {
        window.localStorage.setItem(REMEMBERED_EMAIL_KEY, email)
      } else {
        window.localStorage.removeItem(REMEMBERED_EMAIL_KEY)
      }
    } catch {
      // Ignore storage failures.
    }
  }

  async function handleSendOtp(email: string, password: string) {
    setIsLoading(true)
    try {
      const res = await fetch("/api/auth/login-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      })
      const data = await res.json()
      if (res.ok) {
        persistRememberedEmail(email)
        toast.success("OTP sent to your email!")
        setShowTwoFactor(true)
      } else {
        toast.error(data.error || "Failed to send OTP.")
      }
    } catch (error) {
      toast.error("Something went wrong.")
    } finally {
      setIsLoading(false)
    }
  }

  async function onSubmit(data: LoginFormValues) {
    setIsLoading(true)

    if (showTwoFactor) {
      if (!data.code) {
        toast.error("Please enter the 2FA code")
        setIsLoading(false)
        return
      }

      try {
        const response = await signIn("credentials", {
          email: data.email,
          password: data.password,
          code: data.code,
          redirect: false,
        })

        if (response?.error) {
          if (response.error === "2FA_REQUIRED") {
            toast.error("Please request a new OTP.")
          } else {
            toast.error(response.error === "CredentialsSignin" ? "Invalid code." : response.error)
          }
          setIsLoading(false)
        } else if (response?.ok) {
          toast.success("Welcome back!")
          router.push("/dashboard")
          router.refresh()
          // Intentionally keeping isLoading = true here so the spinner stays visible during redirection
        }
      } catch (error) {
        toast.error("Something went wrong. Please try again.")
        setIsLoading(false)
      }
    } else {
      // Step 1: Send OTP instead of signing in directly
      await handleSendOtp(data.email, data.password)
    }
  }

  return (
    <div className="w-full">
      <AuthCardHeader
        icon={showTwoFactor ? ShieldCheck : LogIn}
        title={showTwoFactor ? "Verify it's you" : "Sign In"}
        description={
          showTwoFactor ? (
            <>
              Enter the 6-digit code we sent to{" "}
              <span className="font-medium text-foreground">{getValues("email")}</span>.
            </>
          ) : (
            "Welcome back. Sign in to continue to your workspace."
          )
        }
      />

      {!showTwoFactor && (
        <>
          <GoogleButton mode="login" />
          <AuthDivider />
        </>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        {!showTwoFactor && (
          <>
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

            <div className="space-y-1.5">
              <Label htmlFor="password" className="sr-only">
                Password
              </Label>
              <div className="relative">
                <Lock
                  className="pointer-events-none absolute top-1/2 left-3 z-10 h-4 w-4 -translate-y-1/2 text-muted-foreground"
                  aria-hidden="true"
                />
                <PasswordInput
                  id="password"
                  placeholder="Password"
                  autoComplete="current-password"
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

            <div className="flex items-center justify-between gap-3 pt-0.5">
              <label
                htmlFor="remember-me"
                className="flex cursor-pointer items-center gap-2 text-xs font-medium text-muted-foreground select-none"
              >
                <Checkbox
                  id="remember-me"
                  checked={rememberMe}
                  onCheckedChange={(checked) => setRememberMe(Boolean(checked))}
                  disabled={isLoading}
                  className="border-muted-foreground/40 dark:border-muted-foreground/50"
                />
                Remember me
              </label>

              <Link
                href="/forgot-password"
                className="text-xs font-semibold text-[#c82020] hover:underline dark:text-rose-400"
              >
                Forgot password?
              </Link>
            </div>
          </>
        )}

        {showTwoFactor && (
          <div className="space-y-1.5">
            <Label htmlFor="code" className="sr-only">
              Two-factor code
            </Label>
            <Input
              id="code"
              type="text"
              inputMode="numeric"
              placeholder="123456"
              autoComplete="one-time-code"
              disabled={isLoading}
              {...register("code")}
              className={cn(
                "h-12 rounded-lg text-center text-lg tracking-[0.35em]",
                errors.code && "border-red-500 focus-visible:ring-red-500"
              )}
            />
            {errors.code && <p className="text-xs text-red-500">{errors.code.message}</p>}

            <div className="flex justify-end pt-1">
              <button
                type="button"
                className="text-xs font-semibold text-[#c82020] hover:underline disabled:opacity-60 dark:text-rose-400"
                onClick={() => handleSendOtp(getValues("email"), getValues("password"))}
                disabled={isLoading}
              >
                Resend code
              </button>
            </div>
          </div>
        )}

        <Button
          type="submit"
          disabled={isLoading}
          className="h-10 w-full rounded-lg bg-[#c82020] text-sm font-semibold text-white shadow-sm shadow-[#c82020]/25 hover:bg-[#a81a1a]"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {showTwoFactor ? "Verifying..." : "Signing in..."}
            </>
          ) : showTwoFactor ? (
            "Verify Code"
          ) : (
            "Sign In"
          )}
        </Button>
      </form>

      {showTwoFactor ? (
        <button
          type="button"
          onClick={() => setShowTwoFactor(false)}
          className="mt-5 w-full text-center text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          Use a different account
        </button>
      ) : (
        <div className="mt-6 text-center text-sm">
          <span className="text-muted-foreground">Don&apos;t have an account? </span>
          <Link
            href="/register"
            className="font-semibold text-[#c82020] hover:underline dark:text-rose-400"
          >
            Create one
          </Link>
        </div>
      )}
    </div>
  )
}

"use client"

import { useState } from "react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import Link from "next/link"
import { toast } from "sonner"
import { Camera, CheckCircle2, Loader2, Lock, Mail, ShieldCheck, User, UserPlus } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import { AuthCardHeader } from "./auth-card-header"
import { AuthDivider } from "./auth-divider"
import { GoogleButton } from "./google-button"
import { PasswordInput } from "./password-input"
import { PasswordStrength } from "./password-strength"

const registerSchema = z.object({
  name: z.string().min(1, "Full name is required"),
  email: z.string().min(1, "Email is required").email("Please enter a valid email address"),
  password: z
    .string()
    .min(8, "Password must contain at least 8 characters")
    .regex(/[A-Z]/, "Password must contain one uppercase letter")
    .regex(/[a-z]/, "Password must contain one lowercase letter")
    .regex(/[0-9]/, "Password must contain one number"),
  confirmPassword: z.string().min(1, "Please confirm your password"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
})

type RegisterFormValues = z.infer<typeof registerSchema>

export function RegisterForm() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  // OTP States
  const [isOtpMode, setIsOtpMode] = useState(false)
  const [otp, setOtp] = useState("")
  const [registeredEmail, setRegisteredEmail] = useState("")
  const [registeredPassword, setRegisteredPassword] = useState("")
  const [photoBase64, setPhotoBase64] = useState<string | null>(null)

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast.error("Image must be less than 2MB")
        return
      }
      const reader = new FileReader()
      reader.onloadend = () => {
        setPhotoBase64(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  })

  const passwordValue = watch("password")

  async function onSubmit(data: RegisterFormValues) {
    setIsLoading(true)

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          password: data.password,
          image: photoBase64,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Failed to register")
      }

      const responseData = await response.json()

      if (responseData.requireOtp) {
        setRegisteredEmail(data.email)
        setRegisteredPassword(data.password)
        setIsOtpMode(true)

        if (responseData.otp) {
          console.log("=========================================")
          console.log(`DEV MODE OTP: ${responseData.otp}`)
          console.log("=========================================")
          toast.success(`OTP for dev testing: ${responseData.otp}`)
        } else {
          toast.success("OTP sent to your email (check console)")
        }

        setIsLoading(false)
        return
      }

      // Legacy fallback if no OTP required
      await signInWithCredentials(data.email, data.password)

    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Something went wrong. Please try again."
      )
      setIsLoading(false)
    }
  }

  async function handleVerifyOtp(e: React.FormEvent) {
    e.preventDefault()
    if (otp.length !== 6) {
      toast.error("Please enter a 6-digit OTP")
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: registeredEmail,
          otp,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Invalid OTP")
      }

      toast.success("Email verified successfully!")
      await signInWithCredentials(registeredEmail, registeredPassword)
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Invalid or expired OTP")
      setIsLoading(false)
    }
  }

  async function signInWithCredentials(email: string, password: string) {
    const signInResponse = await signIn("credentials", {
      email: email,
      password: password,
      redirect: false,
    })

    if (signInResponse?.error) {
      toast.error("Account verified, but couldn't sign in automatically.")
      router.push("/login")
    } else {
      setIsSuccess(true)

      // Wait a moment so user can see success state before redirect
      setTimeout(() => {
        router.push("/dashboard")
        router.refresh()
      }, 1500)
    }
  }

  if (isSuccess) {
    return (
      <div className="w-full py-6 text-center">
        <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500 text-white shadow-lg shadow-emerald-500/25">
          <CheckCircle2 className="h-7 w-7" aria-hidden="true" />
        </div>
        <h1 className="text-xl font-semibold tracking-tight sm:text-2xl">Account Created</h1>
        <p className="mt-1.5 text-sm text-muted-foreground">
          Welcome to Times Works. Redirecting you to the dashboard...
        </p>
        <Loader2 className="mx-auto mt-6 h-5 w-5 animate-spin text-[#c82020] dark:text-rose-400" />
      </div>
    )
  }

  if (isOtpMode) {
    return (
      <div className="w-full">
        <AuthCardHeader
          icon={ShieldCheck}
          title="Verify your email"
          description={
            <>
              We sent a 6-digit code to{" "}
              <span className="font-medium text-foreground">{registeredEmail}</span>.
            </>
          }
        />

        <form onSubmit={handleVerifyOtp} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="otp" className="sr-only">
              One-time password
            </Label>
            <Input
              id="otp"
              inputMode="numeric"
              placeholder="123456"
              maxLength={6}
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, ""))}
              disabled={isLoading}
              className="h-12 rounded-lg text-center text-lg tracking-[0.35em]"
            />
          </div>

          <Button
            type="submit"
            disabled={isLoading || otp.length !== 6}
            className="h-10 w-full rounded-lg bg-[#c82020] text-sm font-semibold text-white shadow-sm shadow-[#c82020]/25 hover:bg-[#a81a1a]"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Verifying...
              </>
            ) : (
              "Verify Email"
            )}
          </Button>

          <div className="text-center text-sm">
            <button
              type="button"
              onClick={() => setIsOtpMode(false)}
              className="text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              Back to registration
            </button>
          </div>
        </form>
      </div>
    )
  }

  return (
    <div className="w-full">
      <AuthCardHeader
        icon={UserPlus}
        title="Create Account"
        description="Start managing your business documents with Times Works."
      />

      <GoogleButton mode="register" />

      <AuthDivider />

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-3.5" noValidate>
        <div className="space-y-1.5">
          <Label htmlFor="name" className="sr-only">
            Full name
          </Label>
          <div className="relative">
            <User
              className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground"
              aria-hidden="true"
            />
            <Input
              id="name"
              placeholder="Full name"
              autoComplete="name"
              disabled={isLoading}
              {...register("name")}
              className={cn(
                "h-10 rounded-lg pl-9",
                errors.name && "border-red-500 focus-visible:ring-red-500"
              )}
            />
          </div>
          {errors.name && <p className="text-xs text-red-500">{errors.name.message}</p>}
        </div>

        {/* Optional profile photo */}
        <div className="flex items-center gap-3 rounded-lg border border-dashed border-border/80 bg-muted/30 p-2.5">
          <label
            htmlFor="photo"
            className="relative flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center overflow-hidden rounded-full border border-border bg-background text-muted-foreground transition-colors hover:border-[#c82020]/50 hover:text-[#c82020]"
          >
            {photoBase64 ? (
              <img src={photoBase64} alt="Profile preview" className="h-full w-full object-cover" />
            ) : (
              <Camera className="h-4 w-4" aria-hidden="true" />
            )}
          </label>
          <div className="min-w-0 flex-1">
            <Label htmlFor="photo" className="cursor-pointer text-xs font-medium">
              Profile photo
            </Label>
            <p className="text-[11px] text-muted-foreground">Optional · JPG or PNG, max 2 MB</p>
          </div>
          <Input
            id="photo"
            type="file"
            accept="image/*"
            onChange={handlePhotoChange}
            disabled={isLoading}
            className="sr-only"
          />
        </div>

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
              autoComplete="new-password"
              disabled={isLoading}
              {...register("password")}
              className={cn(
                "h-10 rounded-lg pl-9",
                errors.password && "border-red-500 focus-visible:ring-red-500"
              )}
            />
          </div>
          <PasswordStrength password={passwordValue} />
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
              Sending OTP...
            </>
          ) : (
            "Create Account"
          )}
        </Button>
      </form>

      <div className="mt-6 text-center text-sm">
        <span className="text-muted-foreground">Already have an account? </span>
        <Link
          href="/login"
          className="font-semibold text-[#c82020] hover:underline dark:text-rose-400"
        >
          Sign in
        </Link>
      </div>
    </div>
  )
}

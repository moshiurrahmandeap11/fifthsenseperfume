"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { requestEmailOtp, verifyEmail } from "@/services/auth.services";
import {
  VerifyEmailFormData,
  verifyEmailValidationSchema,
} from "@/zod/auth.validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, KeyRound, Loader2, Mail, RefreshCw } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

export default function VerifyEmailForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const emailParam = searchParams.get("email") || "";

  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<VerifyEmailFormData>({
    resolver: zodResolver(verifyEmailValidationSchema),
    defaultValues: {
      email: emailParam,
      otp: "",
    },
  });

  const currentEmail = watch("email");

  useEffect(() => {
    if (emailParam) {
      setValue("email", emailParam);
    }
  }, [emailParam, setValue]);

  // Resend cooldown timer countdown
  useEffect(() => {
    if (resendCooldown <= 0) return;
    const timer = setInterval(() => {
      setResendCooldown((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [resendCooldown]);

  const onSubmit = async (data: VerifyEmailFormData) => {
    try {
      setIsLoading(true);
      await verifyEmail({
        email: data.email,
        otp: data.otp,
      });

      toast.success("Email verified successfully! Welcome to EcomBD.");
      router.push("/customer/dashboard");
      router.refresh();
    } catch (error: unknown) {
      const err = error as { message?: string };
      toast.error(
        err?.message || "Invalid or expired verification code. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    if (!currentEmail || resendCooldown > 0) return;

    try {
      setIsResending(true);
      await requestEmailOtp({ email: currentEmail });
      toast.success("A new verification code has been sent!");
      setResendCooldown(60); // 60s cooldown
    } catch (error: unknown) {
      const err = error as { message?: string };
      toast.error(
        err?.message || "Failed to resend code. Please try again."
      );
    } finally {
      setIsResending(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* Email Address */}
      <div className="space-y-1.5">
        <Label htmlFor="email">Email Address</Label>
        <div className="relative">
          <Mail className="absolute left-3 top-2.5 size-4 text-muted-foreground" />
          <Input
            id="email"
            type="email"
            placeholder="example@ecombd.com"
            className="pl-9"
            disabled={isLoading || !!emailParam}
            {...register("email")}
          />
        </div>
        {errors.email && (
          <p className="text-xs text-destructive">{errors.email.message}</p>
        )}
      </div>

      {/* 6-Digit OTP */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <Label htmlFor="otp">Verification Code</Label>
          <button
            type="button"
            tabIndex={-1}
            onClick={handleResendCode}
            disabled={isResending || resendCooldown > 0 || !currentEmail}
            className="text-xs text-primary hover:underline disabled:text-muted-foreground cursor-pointer flex items-center gap-1"
          >
            {isResending ? (
              <RefreshCw className="size-3 animate-spin" />
            ) : null}
            {resendCooldown > 0
              ? `Resend in ${resendCooldown}s`
              : "Resend Code"}
          </button>
        </div>
        <div className="relative">
          <KeyRound className="absolute left-3 top-2.5 size-4 text-muted-foreground" />
          <Input
            id="otp"
            type="text"
            maxLength={6}
            placeholder="123456"
            className="pl-9 tracking-widest font-mono text-base"
            disabled={isLoading}
            {...register("otp")}
          />
        </div>
        {errors.otp && (
          <p className="text-xs text-destructive">{errors.otp.message}</p>
        )}
      </div>

      {/* Submit Button */}
      <Button type="submit" className="w-full cursor-pointer" disabled={isLoading}>
        {isLoading ? (
          <>
            <Loader2 className="mr-2 size-4 animate-spin" />
            Verifying code...
          </>
        ) : (
          "Verify Email"
        )}
      </Button>

      {/* Footer Navigation */}
      <div className="pt-2 text-center text-xs">
        <Link
          href="/login"
          className="inline-flex items-center gap-1.5 text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="size-3.5" />
          <span>Return to Sign In</span>
        </Link>
      </div>
    </form>
  );
}

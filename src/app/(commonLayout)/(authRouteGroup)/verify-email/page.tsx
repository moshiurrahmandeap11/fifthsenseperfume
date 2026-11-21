import AuthCardWrapper from "@/components/modules/auth/AuthCardWrapper";
import VerifyEmailForm from "@/components/modules/auth/VerifyEmailForm";
import { Metadata } from "next";
import React, { Suspense } from "react";

export const metadata: Metadata = {
  title: "Verify Email | EcomBD Footwear",
  description: "Verify your email address",
};

export default function VerifyEmailPage() {
  return (
    <AuthCardWrapper
      title="Verify Your Email"
      description="Enter the 6-digit verification code sent to your email address to activate your account"
      backButtonLabel="Return to Sign In"
      backButtonHref="/login"
    >
      <Suspense fallback={<div className="h-40 animate-pulse rounded bg-muted/40" />}>
        <VerifyEmailForm />
      </Suspense>
    </AuthCardWrapper>
  );
}

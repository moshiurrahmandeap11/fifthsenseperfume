import AuthCardWrapper from "@/components/modules/auth/AuthCardWrapper";
import ForgotPasswordForm from "@/components/modules/auth/ForgotPasswordForm";
import { Metadata } from "next";
import React, { Suspense } from "react";

export const metadata: Metadata = {
  title: "Forgot Password | EcomBD Footwear",
  description: "Reset your account password via email verification code",
};

export default function ForgotPasswordPage() {
  return (
    <AuthCardWrapper
      title="Reset Password"
      >
      <Suspense fallback={<div className="h-40 animate-pulse rounded bg-muted/40" />}>
        <ForgotPasswordForm />
      </Suspense>
    </AuthCardWrapper>
  );
}

import AuthCardWrapper from "@/components/modules/auth/AuthCardWrapper";
import ResetPasswordForm from "@/components/modules/auth/ResetPasswordForm";
import { Metadata } from "next";
import React, { Suspense } from "react";

export const metadata: Metadata = {
  title: "Set New Password | EcomBD Footwear",
  description: "Enter your verification code and set a new password",
};

export default function ResetPasswordPage() {
  return (
    <AuthCardWrapper
      title="Set New Password"
      >
      <Suspense fallback={<div className="h-40 animate-pulse rounded bg-muted/40" />}>
        <ResetPasswordForm />
      </Suspense>
    </AuthCardWrapper>
  );
}

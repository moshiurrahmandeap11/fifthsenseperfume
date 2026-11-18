import AuthCardWrapper from "@/components/modules/auth/AuthCardWrapper";
import LoginForm from "@/components/modules/auth/LoginForm";
import { Metadata } from "next";
import React, { Suspense } from "react";

export const metadata: Metadata = {
  title: "Login | EcomBD Footwear",
  description: "Sign in to your EcomBD account",
};

export default function LoginPage() {
  return (
    <AuthCardWrapper
      title="Welcome Back"
      description="Enter your email and password to access your account"
      backButtonLabel="Return to Storefront"
      backButtonHref="/"
    >
      <Suspense fallback={<div className="h-40 animate-pulse rounded bg-muted/40" />}>
        <LoginForm />
      </Suspense>
    </AuthCardWrapper>
  );
}

import AuthCardWrapper from "@/components/modules/auth/AuthCardWrapper";
import RegisterForm from "@/components/modules/auth/RegisterForm";
import { Metadata } from "next";
import React, { Suspense } from "react";

export const metadata: Metadata = {
  title: "Create Account | EcomBD Footwear",
  description: "Create your EcomBD customer account",
};

export default function RegisterPage() {
  return (
    <AuthCardWrapper
      title="Create Account"
      backButtonLabel="Already have an account? Sign in"
      backButtonHref="/login"
    >
      <Suspense fallback={<div className="h-40 animate-pulse rounded bg-muted/40" />}>
        <RegisterForm />
      </Suspense>
    </AuthCardWrapper>
  );
}

"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import React, { ReactNode } from "react";

interface AuthCardWrapperProps {
  title: string;
  description?: string;
  children: ReactNode;
  backButtonLabel?: string;
  backButtonHref?: string;
  showSocial?: boolean;
}

export default function AuthCardWrapper({
  title,
  description,
  children,
  backButtonLabel,
  backButtonHref,
}: AuthCardWrapperProps) {
  return (
    <div className="flex min-h-[calc(100vh-80px)] w-full items-center justify-center p-4 py-8">
      <Card className="w-full max-w-md border-border/60 shadow-lg transition-all dark:bg-card">
        <CardHeader className="space-y-1.5 pb-4 text-center">
          
          <CardTitle className="font-semibold text-2xl tracking-tight">
            {title}
          </CardTitle>
          {description && (
            <CardDescription className="text-muted-foreground text-sm">
              {description}
            </CardDescription>
          )}
        </CardHeader>

        <CardContent className="space-y-4">{children}</CardContent>

        {backButtonLabel && backButtonHref && (
          <CardFooter className="flex justify-center border-t pt-4">
            <Link
              href={backButtonHref}
              className="text-muted-foreground text-sm transition-colors hover:text-foreground hover:underline"
            >
              {backButtonLabel}
            </Link>
          </CardFooter>
        )}
      </Card>
    </div>
  );
}

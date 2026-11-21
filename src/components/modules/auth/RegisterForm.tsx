"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { registerUser } from "@/services/auth.services";
import { RegisterFormData, registerValidationSchema } from "@/zod/auth.validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Loader2, Lock, Mail, Phone, User } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

export default function RegisterForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerValidationSchema),
    defaultValues: {
      name: "",
      email: "",
      phoneNumber: "",
      password: "",
      confirmPassword: "",
      savedShoeSize: "41",
    },
  });

  const selectedSize = watch("savedShoeSize");

  const onSubmit = async (data: RegisterFormData) => {
    try {
      setIsLoading(true);
      await registerUser({
        name: data.name,
        email: data.email,
        phoneNumber: data.phoneNumber,
        password: data.password,
        savedShoeSize: data.savedShoeSize,
      });

      toast.success(
        "Account created! A 6-digit verification code has been sent to your email."
      );
      router.push(`/verify-email?email=${encodeURIComponent(data.email)}`);
    } catch (error: unknown) {
      const err = error as { message?: string };
      toast.error(err?.message || "Registration failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-3.5">
      {/* Full Name */}
      <div className="space-y-1">
        <Label htmlFor="name">Full Name</Label>
        <div className="relative">
          <User className="absolute left-3 top-2.5 size-4 text-muted-foreground" />
          <Input
            id="name"
            placeholder="Mohammad Karim"
            className="pl-9"
            disabled={isLoading}
            {...register("name")}
          />
        </div>
        {errors.name && (
          <p className="text-xs text-destructive">{errors.name.message}</p>
        )}
      </div>

      {/* Email */}
      <div className="space-y-1">
        <Label htmlFor="email">Email Address</Label>
        <div className="relative">
          <Mail className="absolute left-3 top-2.5 size-4 text-muted-foreground" />
          <Input
            id="email"
            type="email"
            placeholder="karim@example.com"
            className="pl-9"
            disabled={isLoading}
            {...register("email")}
          />
        </div>
        {errors.email && (
          <p className="text-xs text-destructive">{errors.email.message}</p>
        )}
      </div>

      {/* Phone Number */}
      <div className="space-y-1">
        <Label htmlFor="phoneNumber">Phone Number</Label>
        <div className="relative">
          <Phone className="absolute left-3 top-2.5 size-4 text-muted-foreground" />
          <Input
            id="phoneNumber"
            placeholder="01712345678"
            className="pl-9"
            disabled={isLoading}
            {...register("phoneNumber")}
          />
        </div>
        {errors.phoneNumber && (
          <p className="text-xs text-destructive">{errors.phoneNumber.message}</p>
        )}
      </div>

      {/* Shoe Size Preference Selector */}
      <div className="space-y-1.5 pt-1">
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Ruler className="size-3.5" />
          <span>Select Your Preferred Shoe Size (EU Size)</span>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {POPULAR_SHOE_SIZES.map((size) => (
            <button
              key={size}
              type="button"
              onClick={() => setValue("savedShoeSize", size)}
              className={`flex size-8 items-center justify-center rounded-md border text-xs font-medium transition-all cursor-pointer ${
                selectedSize === size
                  ? "border-primary bg-primary text-primary-foreground shadow-xs"
                  : "border-border bg-background hover:bg-muted"
              }`}
            >
              {size}
            </button>
          ))}
        </div>
      </div>

      {/* Password */}
      <div className="space-y-1">
        <Label htmlFor="password">Password</Label>
        <div className="relative">
          <Lock className="absolute left-3 top-2.5 size-4 text-muted-foreground" />
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            placeholder="••••••••"
            className="pl-9 pr-9"
            disabled={isLoading}
            {...register("password")}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-2.5 text-muted-foreground hover:text-foreground cursor-pointer"
            tabIndex={-1}
          >
            {showPassword ? (
              <EyeOff className="size-4" />
            ) : (
              <Eye className="size-4" />
            )}
          </button>
        </div>
        {errors.password && (
          <p className="text-xs text-destructive">{errors.password.message}</p>
        )}
      </div>

      {/* Confirm Password */}
      <div className="space-y-1">
        <Label htmlFor="confirmPassword">Confirm Password</Label>
        <div className="relative">
          <Lock className="absolute left-3 top-2.5 size-4 text-muted-foreground" />
          <Input
            id="confirmPassword"
            type={showConfirmPassword ? "text" : "password"}
            placeholder="••••••••"
            className="pl-9 pr-9"
            disabled={isLoading}
            {...register("confirmPassword")}
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-3 top-2.5 text-muted-foreground hover:text-foreground cursor-pointer"
            tabIndex={-1}
          >
            {showConfirmPassword ? (
              <EyeOff className="size-4" />
            ) : (
              <Eye className="size-4" />
            )}
          </button>
        </div>
        {errors.confirmPassword && (
          <p className="text-xs text-destructive">
            {errors.confirmPassword.message}
          </p>
        )}
      </div>

      {/* Submit Button */}
      <Button type="submit" className="w-full cursor-pointer" disabled={isLoading}>
        {isLoading ? (
          <>
            <Loader2 className="mr-2 size-4 animate-spin" />
            Creating account...
          </>
        ) : (
          "Create Account"
        )}
      </Button>

      <div className="pt-2 text-center text-xs text-muted-foreground">
        Already have an account?{" "}
        <Link href="/login" className="font-medium text-primary hover:underline">
          Sign In
        </Link>
      </div>
    </form>
  );
}

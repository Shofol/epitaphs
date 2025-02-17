"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import EpSpinner from "@/components/ui/ep-spinner";
import { useRouter } from "next/navigation";
import toastService from "@/lib/toastservice";
import { Button } from "@/components/ui/button";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormDescription,
  Form,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import Image from "next/image";
import { reset } from "@/actions/resetPassword";

const ResetPassword = () => {
  const searchParams = useSearchParams();
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const email = searchParams.get("email")!;

  const formSchema = z
    .object({
      password: z
        .string()
        .min(12, "Password must be at least 12 characters long")
        .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
        .regex(/[a-z]/, "Password must contain at least one lowercase letter")
        .regex(/[0-9]/, "Password must contain at least one number")
        .regex(/[\W_]/, "Password must contain at least one special character"),
      confirmPassword: z
        .string()
        .min(12, "Password must be at least 12 characters long")
        .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
        .regex(/[a-z]/, "Password must contain at least one lowercase letter")
        .regex(/[0-9]/, "Password must contain at least one number")
        .regex(/[\W_]/, "Password must contain at least one special character"),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: "Passwords don't match",
      path: ["confirmPassword"],
    });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch(`/api/auth/users/${email}`);
        const parsedRes = await res.json();

        if (parsedRes.error) {
          toastService.error("Invalid Link");
          setTimeout(() => {
            router.push("/");
          }, 1000);
          return;
        } else {
          if (
            parsedRes.data.passwordResetLinkExpires &&
            new Date(Date.now()) <
              new Date(parsedRes.data.passwordResetLinkExpires)
          ) {
            setShowForm(true);
          } else {
            toastService.error("Inavlid or Expired Link");
            setTimeout(() => {
              router.push("/");
            }, 1000);
          }
        }
      } catch (error) {
        console.error("Fetch error:", error);
      }
    };

    if (email && email !== "") {
      fetchUser();
    }
  }, [email, router]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (values) {
      setLoading(true);
      try {
        const user = await reset(email, values.password);
        if (user.error) {
          toastService.error("Password reset failed");
        } else {
          toastService.success("Password reset successfully");
        }
        router.push("/");
      } catch (error) {
        toastService.error(error);
        router.push("/");
      }
      setLoading(true);
    }
  }

  return (
    <div className="min-w-screen flex min-h-screen items-center justify-center bg-primary font-garamond">
      {showForm && (
        <div className="max-w-lg rounded-lg border border-secondary p-10">
          <div className="flex items-center">
            <Image
              src={"/logo.png"}
              width={60}
              height={60}
              alt="epitaphs logo"
            />
            <span className="mx-2 text-3xl text-secondary">Epitaphs</span>
          </div>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-4 px-3 py-5"
            >
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>New Password</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="********"
                        {...field}
                        type="password"
                        autoComplete="current-password"
                      />
                    </FormControl>
                    <FormDescription>
                      Password should be at least 12 characters long, include a
                      mix of uppercase and lowercase letters, numbers, and
                      special symbols.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm Password</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="********"
                        {...field}
                        type="password"
                        autoComplete="current-password"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end pt-4">
                <Button
                  variant={"secondary"}
                  size={"lg"}
                  className="text-lg font-bold"
                  type="submit"
                >
                  <EpSpinner className={loading ? "visible" : "hidden"} />
                  Reset Password
                </Button>
              </div>
            </form>
          </Form>
        </div>
      )}
    </div>
  );
};

export default ResetPassword;

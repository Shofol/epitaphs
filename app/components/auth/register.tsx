"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import React, { useState } from "react";
import Image from "next/image";
import { Checkbox } from "@/components/ui/checkbox";
import { register } from "@/actions/register";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import EpSpinner from "@/components/ui/ep-spinner";
import VerificationForm from "./verification";
import toastService from "@/lib/toastservice";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";
import { verifyRecaptcha } from "@/actions/verifyTokent";

const Register = () => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [emailSent, setemailSent] = useState(false);
  const { executeRecaptcha } = useGoogleReCaptcha();

  const formSchema = z.object({
    email: z
      .string()
      .email("Email is invalid")
      .regex(
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "Email is invalid",
      ),
    password: z
      .string()
      .min(12, "Password must be at least 12 characters long")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/[0-9]/, "Password must contain at least one number")
      .regex(/[\W_]/, "Password must contain at least one special character"),
    toc: z.boolean({ message: "TOC Must be accepted" }),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const verifyToken = async () => {
    if (!executeRecaptcha) {
      console.log("Execute recaptcha not yet available");
      return false;
    }

    const token = await executeRecaptcha("login");

    const res = await verifyRecaptcha(token as string);
    if (!res?.success) {
      toastService.error("Recaptcha Validation Error. Try again.");
      return false;
    } else {
      if (res.data && res.data.score < 0.5) {
        toastService.error("Suspicious activity detected. We can't proceed");
        return false;
      }
    }
    return true;
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (values) {
      try {
        setLoading(true);

        if (!(await verifyToken())) {
          setLoading(false);
          return;
        }

        const result = await register({
          email: values.email,
          password: values.password,
        });
        if (result?.error) {
          toastService.error(result?.error);
          return;
        } else {
          toastService.success("User Registered Succesfully.");
          setemailSent(true);
        }
        setLoading(false);
      } catch (error) {
        console.log(error);
        setLoading(false);
      }
    }
  }

  return (
    <div className="font-garamond">
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button
            variant={"secondary"}
            size={"lg"}
            className="text-xl font-bold"
          >
            Get Started
          </Button>
        </DialogTrigger>
        <DialogContent
          className="font-garamond"
          aria-describedby="regitration-modal"
        >
          <DialogHeader>
            <DialogTitle>
              <div className="flex items-center">
                <Image
                  src={"/logo.png"}
                  width={60}
                  height={60}
                  alt="epitaphs logo"
                />
                <span className="mx-2 text-3xl text-secondary">Epitaphs</span>
              </div>
            </DialogTitle>
          </DialogHeader>
          {!emailSent && (
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4 px-3 py-5"
              >
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="hello@gmaill.com"
                          {...field}
                          type="email"
                          autoComplete="user-email"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="********"
                          {...field}
                          type="password"
                          autoComplete="current-password"
                        />
                      </FormControl>
                      <FormDescription>
                        Password should be at least 12 characters long, include
                        a mix of uppercase and lowercase letters, numbers, and
                        special symbols.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex items-center pt-2 text-secondary">
                  <FormField
                    control={form.control}
                    name="toc"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <FormLabel className="ml-2">
                          I agree with the terms and conditions
                        </FormLabel>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="flex justify-end pt-4">
                  <Button
                    variant={"secondary"}
                    size={"lg"}
                    className="text-lg font-bold"
                    type="submit"
                  >
                    <EpSpinner className={loading ? "visible" : "hidden"} />
                    Sign Up
                  </Button>
                </div>
              </form>
            </Form>
          )}

          {emailSent && (
            <VerificationForm
              email={form.getValues("email")}
              password={form.getValues("password")}
              onSuccess={() => {
                setOpen(false);
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Register;

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
import Image from "next/image";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import EpSpinner from "@/components/ui/ep-spinner";
import { useState } from "react";
import toastService from "@/lib/toastservice";
import { Checkbox } from "@/components/ui/checkbox";
import ForgotPassword from "./forgotPassword";

const Login = () => {
  const [loading, setLoading] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const router = useRouter();
  const [open, setOpen] = useState(false);

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
    rememberme: z.boolean(),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberme: false,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (values) {
      try {
        setLoading(true);
        const result = await signIn("credentials", {
          email: values.email,
          password: values.password,
          redirect: false,
        });
        if (result?.error) {
          toastService.error(result?.error);
        } else if (result?.ok) {
          toastService.success("Login Succesful.");
          return router.push("/home");
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
            Login
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
          {!showForgotPassword && (
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
                          placeholder="hello@gmail.com"
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
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex items-center justify-between pt-2 text-secondary">
                  <FormField
                    control={form.control}
                    name="rememberme"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <FormLabel className="ml-2">Remember Me</FormLabel>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button
                    variant={"link"}
                    type="button"
                    onClick={() => {
                      setShowForgotPassword(true);
                    }}
                  >
                    Forgot Password
                  </Button>
                </div>

                <div className="flex justify-end pt-4">
                  <Button
                    variant={"secondary"}
                    size={"lg"}
                    className="text-lg font-bold"
                    type="submit"
                  >
                    <EpSpinner className={loading ? "visible" : "hidden"} />
                    Login
                  </Button>
                </div>
              </form>
            </Form>
          )}
          {showForgotPassword && (
            <ForgotPassword
              onSuccess={() => {
                setOpen(false);
                setShowForgotPassword(false);
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Login;

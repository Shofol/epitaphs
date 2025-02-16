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
import { useToast } from "@/hooks/use-toast";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import EpSpinner from "@/components/ui/ep-spinner";
import { useState } from "react";

const Login = () => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

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
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
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
          toast({
            variant: "destructive",
            title: "Error!",
            description: result?.error,
          });
        } else if (result?.ok) {
          toast({
            variant: "success",
            title: "Success",
            description: "Login Succesful.",
          });
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
      <Dialog>
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
                  Login
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Login;

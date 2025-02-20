import { Button } from "@/components/ui/button";
import EpSpinner from "@/components/ui/ep-spinner";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import toastService from "@/lib/toastservice";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const ForgotPassword = ({ onSuccess }: { onSuccess: () => void }) => {
  const [loading, setLoading] = useState(false);

  const formSchema = z.object({
    email: z
      .string()
      .email("Email is invalid")
      .regex(
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "Email is invalid",
      ),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setLoading(true);
    const res = await fetch(`/api/sendResetLink`, {
      method: "post",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: values.email,
      }),
    });

    if (!res.ok) {
      const response = await res.json();
      toastService.error(
        response?.error?.message
          ? response?.error?.message
          : "Operation Failed",
      );
    } else {
      toastService.success(
        "Password reset link is sent. Please check your email.",
      );
      onSuccess();
    }
    setLoading(false);
  };

  return (
    <div className="py-4">
      <p className="text-lg text-secondary">
        Please enter your verified email. A password reset link will be sent.
      </p>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
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
          <div className="flex justify-end pt-4">
            <Button
              variant={"secondary"}
              size={"lg"}
              className="text-lg font-bold"
              type="submit"
              onClick={form.handleSubmit(onSubmit)}
            >
              <EpSpinner className={loading ? "visible" : "hidden"} />
              Submit
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default ForgotPassword;

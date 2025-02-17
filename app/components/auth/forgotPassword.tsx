import { Button } from "@/components/ui/button";
import EpSpinner from "@/components/ui/ep-spinner";
import { Input } from "@/components/ui/input";
import toastService from "@/lib/toastservice";
import React, { useState } from "react";

const ForgotPassword = ({ onSuccess }: { onSuccess: () => void }) => {
  const [email, setEmail] = useState<undefined | string>(undefined);
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    setLoading(true);
    const res = await fetch(`/api/sendResetLink`, {
      method: "post",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: email,
      }),
    });
    if (res?.error) {
      toastService.error(res.error);
    } else {
      toastService.success(
        "Password reset link is sent. Please check your email.",
      );
      onSuccess();
    }
  };

  return (
    <div className="py-4">
      <p className="pb-2 text-lg text-secondary">
        Please enter your verified email. A password reset link will be sent.
      </p>
      <Input
        placeholder="hello@gmail.com"
        type="email"
        defaultValue={email}
        onChange={(e) => {
          setEmail(e.target.value);
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            submit();
          }
        }}
        autoComplete="user-email"
      />

      <div className="flex justify-end pt-4">
        <Button
          variant={"secondary"}
          size={"lg"}
          className="text-lg font-bold"
          type="button"
          onClick={submit}
        >
          <EpSpinner className={loading ? "visible" : "hidden"} />
          Submit
        </Button>
      </div>
    </div>
  );
};

export default ForgotPassword;

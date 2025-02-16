import { verify } from "@/actions/verify";
import { Button } from "@/components/ui/button";
import EpSpinner from "@/components/ui/ep-spinner";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { toast } from "@/hooks/use-toast";
import React, { useState } from "react";

const VerificationForm = ({
  email,
  onSuccess,
}: {
  email: string;
  onSuccess: () => void;
}) => {
  const [verificationCode, setVerificationCode] = useState<string | undefined>(
    undefined,
  );
  const [loading, setLoading] = useState(false);

  const handleVerification = async () => {
    setLoading(true);
    try {
      if (verificationCode && verificationCode.length === 6) {
        const res = await verify({ email, verificationCode });
        if (res?.error) {
          toast({
            variant: "destructive",
            title: "Error!",
            description: res.error as string,
          });
        } else {
          toast({
            variant: "success",
            title: "Success",
            description: "Email Verified Succesfully.",
          });
          onSuccess();
        }
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  return (
    <div className="flex flex-col items-center">
      <p className="p-5 text-center text-xl text-secondary">
        A verification code has been sent to your email. Please check your email
        and enter the code to proceed.
      </p>
      <div className="mb-5 flex justify-center">
        <InputOTP
          maxLength={6}
          value={verificationCode}
          onChange={(value) => {
            setVerificationCode(value);
          }}
        >
          <InputOTPGroup>
            <InputOTPSlot index={0} />
            <InputOTPSlot index={1} />
            <InputOTPSlot index={2} />
            <InputOTPSlot index={3} />
            <InputOTPSlot index={4} />
            <InputOTPSlot index={5} />
          </InputOTPGroup>
        </InputOTP>
      </div>
      <div className="flex justify-end pt-4">
        <Button
          variant={"secondary"}
          size={"lg"}
          className="text-lg font-bold"
          type="button"
          onClick={handleVerification}
        >
          <EpSpinner className={loading ? "visible" : "hidden"} />
          Verify Email
        </Button>
      </div>
    </div>
  );
};

export default VerificationForm;

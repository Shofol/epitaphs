"use client";

import React, { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import EpSpinner from "@/components/ui/ep-spinner";
import { verify } from "@/actions/verify";
import { useRouter } from "next/navigation";
import toastService from "@/lib/toastservice";

const Verify = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const email = searchParams.get("email")!;
  const verificationCode = searchParams.get("code")!;

  useEffect(() => {
    const handleVerification = async () => {
      try {
        if (verificationCode && verificationCode.length === 6) {
          const res = await verify({ email, verificationCode });
          if (res?.error) {
            toastService.error(res.error as string);
          } else {
            toastService.success("Email Verified Succesfully.");
          }
        }
        setTimeout(() => {
          router.push("/");
        }, 1000);
      } catch (error) {
        console.log(error);
      }
    };

    if (email && email !== "" && verificationCode && verificationCode !== "") {
      handleVerification();
    }
  }, [email, verificationCode, router]);

  return (
    <div className="min-w-screen flex min-h-screen items-center justify-center bg-primary font-garamond">
      <div className="flex items-center">
        <EpSpinner className="mr-3 fill-secondary" />
        <p className="text-4xl text-secondary">
          Verifying Email. Please Wait...
        </p>
      </div>
    </div>
  );
};

export default Verify;

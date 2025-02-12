"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import React, { useState } from "react";
import Image from "next/image";
import { Checkbox } from "@/components/ui/checkbox";

const Register = () => {
  const [emailSent, setemailSent] = useState(false);

  return (
    <div className="font-garamond">
      <Dialog>
        <DialogTrigger asChild>
          <Button
            variant={"secondary"}
            size={"lg"}
            className="text-xl font-bold"
          >
            Get Started
          </Button>
        </DialogTrigger>
        <DialogContent className="font-garamond">
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
            <div className="grid gap-4 px-2 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label
                  htmlFor="email"
                  className="text-left text-lg text-secondary"
                >
                  Username
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="hello@gmail.com"
                  className="col-span-3 text-secondary"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label
                  htmlFor="password"
                  className="text-left text-lg text-secondary"
                >
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  placeholder=""
                  className="col-span-3 text-secondary"
                />
              </div>

              <div className="flex items-center pt-5 text-secondary">
                <Checkbox id="terms" />
                <label
                  htmlFor="terms"
                  className="text-md ml-2 font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  I agree with the terms and conditions
                </label>
              </div>
            </div>
          )}

          {emailSent && (
            <p className="p-5 text-center text-xl text-secondary">
              A verification code has been sent to your email. Please check your
              email and enter the code to proceed.
            </p>
          )}

          <DialogFooter>
            <Button
              variant={"secondary"}
              size={"lg"}
              className="text-lg font-bold"
              type="submit"
              onClick={() => {
                setemailSent(!emailSent);
              }}
            >
              Sign Up
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Register;

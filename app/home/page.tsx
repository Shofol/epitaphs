"use client";

import React from "react";
// import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
// import { AlertCircle } from "lucide-react";
import { useSession } from "next-auth/react";

const Home = () => {
  const { data: session } = useSession();
  return (
    <div className="min-w-screen flex min-h-screen items-center justify-center bg-primary py-10">
      <h1 className="text-secondary">Welcome {session?.user?.email}</h1>
    </div>
  );
};

export default Home;

"use client";

import Image from "next/image";
import Register from "./components/auth/register";
import Login from "./components/auth/login";
import { signOut, useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const session = useSession();
  const router = useRouter();

  useEffect(() => {
    if (session.status === "authenticated" && session.data.expires) {
      const sessionExpiry = new Date(session.data.expires).getTime();
      const now = Date.now();

      if (now > sessionExpiry) {
        signOut(); // Log out user
        router.push("/login"); // Redirect to login page
      }
    }
  }, [session, router]);

  return (
    <div className="min-h-screen w-screen bg-primary pb-10 font-garamond">
      <nav className="flex w-screen items-center justify-between px-10 py-5">
        <div className="flex items-center">
          <Image
            src={"/logo.png"}
            width={100}
            height={100}
            alt="epitaphs logo"
          />
          <span className="mx-4 text-4xl text-secondary">Epitaphs</span>
        </div>

        {session.status === "authenticated" ? (
          <Button
            variant={"secondary"}
            size={"lg"}
            className="text-lg font-bold"
            type="button"
            onClick={() => {
              signOut({ redirect: false });
            }}
          >
            Logout
          </Button>
        ) : (
          <Login />
        )}
      </nav>
      <main className="mx-auto max-w-7xl px-5 lg:px-0">
        <h1 className="mt-10 text-justify text-4xl text-secondary">
          Grief is personal, yet we are united by a profound ache to extend our
          time with those who have departed. We find solace in rituals that keep
          their memories alive: tracing old photographs, preserving voicemails,
          and writing letters. There is now another way help bring comfort and
          closure to those experiencing loss.
        </h1>

        <h2 className="my-20 text-center text-4xl font-bold text-secondary">
          How it works
        </h2>
        <div className="grid grid-cols-3 gap-10 text-secondary">
          <div className="flex flex-col items-center">
            <h3 className="text-3xl font-bold">Upload memories:</h3>
            <p className="mt-4 text-center text-2xl">
              Share messages, audio, videos, and more that capture who they are
            </p>
          </div>

          <div className="flex flex-col items-center">
            <h3 className="text-3xl font-bold">Create your epitaph:</h3>
            <p className="mt-4 text-center text-2xl">
              Your epitaph trains itself to think, talk, and sound like your
              dearly departed
            </p>
          </div>

          <div className="flex flex-col items-center">
            <h3 className="text-3xl font-bold">Speak with them:</h3>
            <p className="mt-4 text-center text-2xl">
              Ask advice, share your milestones, resolve your regrets
            </p>
          </div>
        </div>

        <div className="my-16 flex justify-center">
          <Register />
        </div>
      </main>
      <footer></footer>
    </div>
  );
}

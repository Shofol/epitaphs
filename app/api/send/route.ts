import { Resend } from "resend";
import * as React from "react";
import { EmailTemplate } from "@/app/components/email/template";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const { verificationCode } = await request.json();
    // Extract host from request headers
    const host = request.headers.get("host");
    const protocol = host?.includes("localhost") ? "http" : "https"; // Determine protocol
    const baseUrl = `${protocol}://${host}`; // Construct full base URL

    const { data, error } = await resend.emails.send({
      from: "czarnke@epitaphs.ai",
      to: ["jahananower@gmail.com"],
      subject: "Confirm your email address to safeguard your epitaphs account",
      react: EmailTemplate({
        verificationCode: verificationCode,
        baseUrl: baseUrl,
      }) as React.ReactElement,
    });

    if (error) {
      return Response.json({ error }, { status: 500 });
    }

    return Response.json({ data });
  } catch (error) {
    return Response.json({ error }, { status: 500 });
  }
}

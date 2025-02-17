import { Resend } from "resend";
import * as React from "react";
import { EmailTemplate } from "@/app/components/email/forgotPassTemplate";
import User from "@/models/User";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const { email } = await request.json();
    // Extract host from request headers
    const host = request.headers.get("host");
    const protocol = host?.includes("localhost") ? "http" : "https"; // Determine protocol
    const baseUrl = `${protocol}://${host}`; // Construct full base URL

    const { data, error } = await resend.emails.send({
      from: "czarnke@epitaphs.ai",
      to: [email],
      subject: "Reset your Epitaphs Password",
      react: EmailTemplate({
        email: email,
        baseUrl: baseUrl,
      }) as React.ReactElement,
    });

    console.log(error);
    if (error) {
      return Response.json({ error }, { status: 500 });
    }

    try {
      console.log(email);
      // Update user in the database
      await User.findOneAndUpdate(
        { email }, // Find user by email
        {
          $set: {
            passwordResetLinkExpires: new Date(Date.now() + 15 * 60 * 1000),
          }, // Set verified to true
        },
        { new: true }, // Return the updated user
      );
    } catch (error) {
      return Response.json({ error }, { status: 500 });
    }

    return Response.json({ data });
  } catch (error) {
    return Response.json({ error }, { status: 500 });
  }
}

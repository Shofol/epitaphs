import * as React from "react";

interface EmailTemplateProps {
  email: string;
  baseUrl: string;
}

export const EmailTemplate: React.FC<Readonly<EmailTemplateProps>> = ({
  email,
  baseUrl,
}) => (
  <div className="border-2 border-primary p-10">
    <p>
      We received a request to reset your Epitaphs password. If you made this
      request, click the link below to reset your password.
      <br />
      <a
        href={`${baseUrl}/auth/reset-password?email=${email}`}
        target="_blank"
        rel="noreferrer"
      >
        {`${baseUrl}/auth/reset-password?email=${email}`}
      </a>
      <br />
      The link and code will expire in 15 minutes, if you did not sign up for an
      account on Epitaphs you can safely ignore this email.
    </p>
    <p>
      Thank You, <br />
      The Epitaphs Team
    </p>
  </div>
);

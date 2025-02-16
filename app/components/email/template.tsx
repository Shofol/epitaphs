import * as React from "react";

interface EmailTemplateProps {
  verificationCode: string;
  baseUrl: string;
}

export const EmailTemplate: React.FC<Readonly<EmailTemplateProps>> = ({
  verificationCode,
  baseUrl,
}) => (
  <div>
    <p>
      Hello, Before we can set up your Epitaphs account, we need to confirm your
      email.
      <br />
      Either enter this 6 digit code: <b>{verificationCode} </b>
      <br />
      Or click the link below to confirm your account.
      <br />
      <a
        href={`${baseUrl}/auth/verify?code=${verificationCode}`}
        target="_blank"
        rel="noreferrer"
      >
        {`${baseUrl}/auth/verify?code=${verificationCode}`}
      </a>
      <br />
      The link and code will expire in 15 minutes, if you did not sign up for an
      account on Epitaphs you can safely ignore this email.
    </p>
    <p>
      Welcome, <br />
      The Epitaphs Team
    </p>
  </div>
);

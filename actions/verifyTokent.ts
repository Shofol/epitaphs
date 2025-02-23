"use server";

export async function verifyRecaptcha(token: string): Promise<ResponseType> {
  const secretKey = process.env.RECAPTCHA_SECRET_KEY;

  if (!secretKey) {
    throw new Error("reCAPTCHA secret key is missing.");
  }

  try {
    const response = await fetch(
      "https://www.google.com/recaptcha/api/siteverify",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          secret: secretKey,
          response: token,
        }).toString(),
      },
    );

    const data = await response.json();

    if (!data.success) {
      return {
        success: false,
        error: data["error-codes"] || "Verification failed",
      };
    }

    return { success: true, data: data };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
}

type ResponseType = {
  success: boolean;
  error?: string;
  data?: ResponseData;
};

type ResponseData = {
  success: boolean;
  challenge_ts: string;
  hostname: string;
  score: number;
  action: string;
};

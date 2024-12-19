import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const SECRET_KEY = process.env.SECRET_KEY || "your-secret-key";
const VALID_API_KEYS = process.env.VALID_API_KEYS?.split(",") || [];

/**
 * Middleware to validate authentication using either an API key or JWT.
 *
 * @param allowApiKey - Boolean to enable/disable API key access.
 */
export function createAuthMiddleware(allowApiKey: boolean) {
  return async (request: Request) => {
    const apiKey = request.headers.get("x-api-key");
    const cookies = request.headers.get("cookie");
    const token = cookies
      ?.split("; ")
      .find((c) => c.startsWith("auth_token="))
      ?.split("=")[1];

    let isApiKeyValid = false;
    let isAuthTokenValid = false;

    // Validate API key if enabled
    if (allowApiKey && apiKey) {
      isApiKeyValid = VALID_API_KEYS.includes(apiKey);
    }

    // Validate JWT
    if (token) {
      try {
        const decoded = jwt.verify(token, SECRET_KEY);
        if (decoded && typeof decoded === "object" && decoded.authenticated) {
          isAuthTokenValid = true;
        }
      } catch (err) {
        console.error("Token verification failed:", err);
      }
    }

    // If neither API key nor JWT is valid, reject the request
    if (!isApiKeyValid && !isAuthTokenValid) {
      return new NextResponse(
        JSON.stringify({ message: "Unauthorized: Invalid token" }),
        { status: 401, headers: { "Content-Type": "application/json" } }
      );
    }

    // Proceed to the handler if valid
    return NextResponse.next();
  };
}

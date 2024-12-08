import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const SECRET_KEY = process.env.SECRET_KEY || "your-secret-key";

export async function GET(request: Request) {
  const cookies = request.headers.get("cookie");
  const token = cookies
    ?.split("; ")
    .find((c) => c.startsWith("auth_token="))
    ?.split("=")[1];

  if (token) {
    try {
      const decoded = jwt.verify(token, SECRET_KEY); // Validate the token
      if (decoded) {
        return NextResponse.json({ authenticated: true });
      }
    } catch (err) {
      console.error("Token verification failed:", err);
    }
  }

  return NextResponse.json({ authenticated: false }, { status: 401 });
}

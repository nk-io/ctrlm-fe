import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const SECRET_KEY = process.env.SECRET_KEY || "your-secret-key"; // Replace with a secure secret key

export async function POST(request: Request) {
  const { password } = await request.json();

  // Validate the password
  if (password === process.env.PASSWORD) {
    // Generate a signed token
    const token = jwt.sign({ authenticated: true }, SECRET_KEY, {
      expiresIn: "1d",
    });

    // Set the cookie with the signed token
    const response = NextResponse.json({ success: true });
    response.cookies.set("auth_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24, // 1 day
      sameSite: "strict",
      path: "/",
    });

    return response;
  }

  return NextResponse.json(
    { success: false, message: "Invalid password" },
    { status: 401 }
  );
}

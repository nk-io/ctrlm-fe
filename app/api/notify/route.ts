import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const SECRET_KEY = process.env.SECRET_KEY || "your-secret-key";

export async function POST(req: NextRequest) {
  const cookies = req.headers.get("cookie");
  const token = cookies
    ?.split("; ")
    .find((c) => c.startsWith("auth_token="))
    ?.split("=")[1];

  if (!token) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    if (!decoded || typeof decoded !== "object" || !decoded.authenticated) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
  } catch (err) {
    console.error("Token verification failed:", err);
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { username } = body;

  if (!username || typeof username !== "string" || username.trim() === "") {
    return NextResponse.json(
      { message: "Valid username is required" },
      { status: 400 }
    );
  }

  const discordWebhookUrl = process.env.DISCORD_WEB_HOOK;
  const telegramBotToken = process.env.TELEGRAM_BOT_TOKEN;
  const telegramChatId = process.env.TELEGRAM_CHAT_ID;

  const messageTemplate =
    process.env.MESSAGE_TEMPLATE || "{username} is ready!";
  const message = messageTemplate.replace("{username}", username);

  try {
    // Send to Discord
    if (discordWebhookUrl) {
      const discordResponse = await fetch(discordWebhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: message }),
      });

      if (!discordResponse.ok) {
        throw new Error(
          `Discord response error: ${discordResponse.statusText}`
        );
      }
    }

    // Send to Telegram
    if (telegramBotToken && telegramChatId) {
      const telegramUrl = `https://api.telegram.org/bot${telegramBotToken}/sendMessage`;
      const telegramResponse = await fetch(telegramUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: telegramChatId,
          text: message,
        }),
      });

      if (!telegramResponse.ok) {
        throw new Error(
          `Telegram response error: ${telegramResponse.statusText}`
        );
      }
    }

    return NextResponse.json({ message: "Notification sent successfully!" });
  } catch (error) {
    console.error("Error sending notification:", error);

    return NextResponse.json(
      { message: "Failed to send notification", error: String(error) },
      { status: 500 }
    );
  }
}

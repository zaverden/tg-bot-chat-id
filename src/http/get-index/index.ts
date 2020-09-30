import { Dictionary, getJsonBody, isDictionary, isNumber } from "./utils.ts";

function getTgBotUrl(botToken: string): string {
  return `https://api.telegram.org/bot${botToken}`;
}

function sendMarkdownMessage(botToken: string, chatId: number, text: string) {
  return fetch(`${getTgBotUrl(botToken)}/sendMessage`, {
    method: "POST",
    body: JSON.stringify({
      chat_id: chatId,
      parse_mode: "MarkdownV2",
      text,
    }),
  });
}

function sendChatId(botToken: string, chatId: number) {
  return sendMarkdownMessage(botToken, chatId, `Chat ID is \`${chatId}\``);
}

export async function handler(req: Dictionary) {
  const body = getJsonBody(req);
  const botToken = Deno.env.get("BOT_TOKEN_ID");

  if (botToken == null || botToken === "") {
    throw new Error("BOT_TOKEN_ID environment variable is not provided");
  }

  if (
    isDictionary(body.message) &&
    isDictionary(body.message.chat) &&
    isNumber(body.message.chat.id)
  ) {
    await sendChatId(botToken, body.message.chat.id);
  }
  // console.log("env", JSON.stringify(Deno.env.toObject()));
  // const ip = await fetch("https://ifconfig.co/ip").then((r) => r.text());
  // console.log("ip", ip);
  return {
    statusCode: 200,
    body: JSON.stringify({ ok: true }),
  };
}

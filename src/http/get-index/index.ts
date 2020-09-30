import { Dictionary, getJsonBody, isDictionary, isNumber } from "./utils.ts";

function getTgBotUrl(botToken: string): string {
  return `https://api.telegram.org/bot${botToken}`;
}

async function sendMarkdownMessage(
  botToken: string,
  chatId: number,
  text: string
) {
  await fetch(`${getTgBotUrl(botToken)}/sendMessage`, {
    method: "POST",
    body: JSON.stringify({
      chat_id: chatId,
      parse_mode: "MarkdownV2",
      text,
    }),
  });
}

async function sendChatId(botToken: string, chatId: number) {
  try {
    await sendMarkdownMessage(botToken, chatId, `Chat ID is \`${chatId}\``);
  } catch (err) {
    console.log(`Error sending chat id: ${err}`);
  }
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
  } else {
    console.log("ignore request", JSON.stringify(body));
  }
  // console.log("env", JSON.stringify(Deno.env.toObject()));
  // const ip = await fetch("https://ifconfig.co/ip").then((r) => r.text());
  // console.log("ip", ip);
  return {
    statusCode: 200,
    body: JSON.stringify({ ok: true }),
  };
}

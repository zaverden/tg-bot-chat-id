import { Dictionary, getJsonBody, isDictionary, isNumber } from "./utils.ts";

function getTgBotUrl(botToken: string): string {
  return `https://api.telegram.org/bot${botToken}`;
}

async function callTelegramApi(
  botToken: string,
  method: string,
  body: Dictionary
) {
  const response = await fetch(`${getTgBotUrl(botToken)}/${method}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
  if (response.status !== 200) {
    const responseText = await response.text();
    console.log(`sendMessage response ${response.status}: ${responseText}`);
  }
}

async function sendMarkdownMessage(
  botToken: string,
  chatId: number,
  text: string
) {
  await callTelegramApi(botToken, "sendMessage", {
    chat_id: chatId,
    parse_mode: "MarkdownV2",
    text,
  });
}

async function sendChatId(botToken: string, chatId: number) {
  await sendMarkdownMessage(botToken, chatId, `Chat ID is \`${chatId}\``);
}

async function leaveChat(botToken: string, chatId: number) {
  await callTelegramApi(botToken, "leaveChat", { chat_id: chatId });
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
    if (body.message.chat.type !== "private") {
      await sendMarkdownMessage(botToken, body.message.chat.id, "_fly away_");
      await leaveChat(botToken, body.message.chat.id);
    }
  } else {
    console.log("ignore request", JSON.stringify(body));
  }
  return {
    statusCode: 200,
    body: JSON.stringify({ ok: true }),
  };
}

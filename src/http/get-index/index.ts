import { Dictionary, getJsonBody } from "./getJsonBody.ts";

export async function handler(req: Dictionary) {
  const body = getJsonBody(req);
  console.log("request", JSON.stringify(body));
  // console.log("env", JSON.stringify(Deno.env.toObject()));
  // const ip = await fetch("https://ifconfig.co/ip").then((r) => r.text());
  // console.log("ip", ip);
  return {
    statusCode: 200,
    body: JSON.stringify({ ok: true }),
  };
}

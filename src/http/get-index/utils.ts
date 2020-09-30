export type Dictionary<T = unknown> = { [K: string]: T };

export function getJsonBody(request: Dictionary): Dictionary {
  if (typeof request.body !== "string") {
    console.log(
      `Expected request.body to be a string, but got ${typeof request.body}`
    );
    return {};
  }
  try {
    const json = JSON.parse(request.body);
    return isDictionary(json) ? json : {};
  } catch (err) {
    console.log(`Error parsing request.body: content: ${request.body}`);
    console.log(`Error parsing request.body: error: ${err}`);
    return {};
  }
}

export function isDictionary(obj: unknown): obj is Dictionary {
  return typeof obj === "object" && obj != null && !Array.isArray(obj);
}

export function isNumber(obj: unknown): obj is number {
  return typeof obj === "number";
}

export type ResponsePayload = Record<string, unknown>;

type PayloadSource = { payload?: unknown } | null | undefined;

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

export function extractResponsePayload(source?: PayloadSource): ResponsePayload {
  const payload = source?.payload;
  if (!isRecord(payload)) {
    return {};
  }
  return payload;
}

export function readPayloadString(
  payload: ResponsePayload,
  key: string
): string | undefined {
  const value = payload[key];
  return typeof value === "string" ? value : undefined;
}

export function readPayloadNumber(
  payload: ResponsePayload,
  key: string
): number | undefined {
  const value = payload[key];
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }
  if (typeof value === "string" && value.trim().length > 0) {
    const parsed = Number(value);
    if (Number.isFinite(parsed)) {
      return parsed;
    }
  }
  return undefined;
}

export function stringifyPayloadValue(value: unknown): string {
  if (value === undefined || value === null) {
    return "";
  }
  if (typeof value === "string") {
    return value;
  }
  if (typeof value === "number" || typeof value === "boolean") {
    return String(value);
  }
  try {
    return JSON.stringify(value);
  } catch {
    return "";
  }
}

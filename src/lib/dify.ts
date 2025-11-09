function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function parseOutputPayload(value: unknown): Record<string, unknown> {
  if (typeof value === "string") {
    try {
      const parsed = JSON.parse(value);
      if (isObject(parsed)) {
        return parsed;
      }
    } catch {
      return {};
    }
  }

  if (isObject(value)) {
    return value;
  }

  return {};
}

function unwrapOutputs(value: unknown): unknown {
  let current = value;

  while (isObject(current) && "outputs" in current) {
    current = (current as { outputs: unknown }).outputs;
  }

  return current;
}

export function parseDifyOutputs(json: unknown): Record<string, unknown> {
  let outputsRaw: unknown = {};

  if (isObject(json)) {
    const data = json.data as Record<string, unknown> | undefined;
    if (isObject(data) && data.outputs !== undefined) {
      outputsRaw = data.outputs;
    } else if ("outputs" in json) {
      outputsRaw = (json as { outputs: unknown }).outputs;
    }
  }

  return parseOutputPayload(unwrapOutputs(outputsRaw));
}

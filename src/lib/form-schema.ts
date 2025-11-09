export type FormFieldDefinition = {
  key: string;
  label: string;
  type?: string;
  required?: boolean;
};

export type FormSchema = {
  fields?: FormFieldDefinition[];
};

export const LOCKED_FIELDS: FormFieldDefinition[] = [
  { key: "name", label: "お名前", type: "text", required: true },
  { key: "rating", label: "総合評価", type: "rating", required: true },
];

export const LOCKED_FIELD_KEYS = new Set(LOCKED_FIELDS.map((field) => field.key));

export function slugifyLabel(label: string): string {
  return (
    label
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "_")
      .replace(/^_+|_+$/g, "")
      .replace(/__+/g, "_") || "custom"
  );
}

const isPlainRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const parseSchemaObject = (value: unknown): Record<string, unknown> | undefined => {
  if (isPlainRecord(value)) {
    return value;
  }
  if (typeof value === "string") {
    try {
      const parsed = JSON.parse(value);
      if (isPlainRecord(parsed)) {
        return parsed;
      }
    } catch {
      return undefined;
    }
  }
  return undefined;
};

export function parseFormSchemaFields(rawSchema: unknown): FormFieldDefinition[] {
  const schema = parseSchemaObject(rawSchema);
  if (!schema) {
    return [];
  }
  const fields = schema.fields;
  if (!Array.isArray(fields)) {
    return [];
  }

  const normalized: FormFieldDefinition[] = [];
  for (const field of fields) {
    if (!isPlainRecord(field)) {
      continue;
    }
    const key =
      typeof field.key === "string" && field.key.trim().length > 0 ? field.key.trim() : "";
    if (!key) {
      continue;
    }
    normalized.push({
      key,
      label:
        typeof field.label === "string" && field.label.trim().length > 0
          ? field.label
          : key,
      type: typeof field.type === "string" ? field.type : undefined,
      required: typeof field.required === "boolean" ? field.required : undefined,
    });
  }
  return normalized;
}

export type QuestionAnswerEntry = {
  key: string;
  question: string;
  value: unknown;
};

export function createQuestionAnswerList(
  payload: Record<string, unknown>,
  schemaFields: FormFieldDefinition[]
): QuestionAnswerEntry[] {
  const fieldByKey = new Map(schemaFields.map((field) => [field.key, field]));
  const seen = new Set<string>();
  const orderedKeys: string[] = [];

  for (const field of schemaFields) {
    if (seen.has(field.key)) {
      continue;
    }
    seen.add(field.key);
    orderedKeys.push(field.key);
  }

  for (const key of Object.keys(payload)) {
    if (seen.has(key)) {
      continue;
    }
    seen.add(key);
    orderedKeys.push(key);
  }

  return orderedKeys.map((key) => ({
    key,
    question: fieldByKey.get(key)?.label ?? key,
    value: payload[key],
  }));
}

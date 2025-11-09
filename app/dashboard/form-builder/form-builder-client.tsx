"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState, useTransition } from "react";
import {
  FormFieldDefinition,
  FormSchema,
  LOCKED_FIELD_KEYS,
  LOCKED_FIELDS,
  slugifyLabel,
} from "@/lib/form-schema";

// dnd-kit
import {
  DndContext,
  DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

type BuilderField = FormFieldDefinition & { id: string; locked?: boolean; required: boolean };

type FormBuilderProps = {
  company: {
    id: string;
    name?: string | null;
    form_schema?: FormSchema | null;
  };
};

const cn = (...classes: Array<string | false | null | undefined>) =>
  classes.filter(Boolean).join(" ");

function createInitialFields(schema?: FormSchema | null): BuilderField[] {
  const customFields =
    schema?.fields
      ?.filter((f): f is FormFieldDefinition => Boolean(f?.key))
      .filter((f) => !LOCKED_FIELD_KEYS.has(f.key))
      .map((f, i) => ({
        id: `custom-${f.key ?? i}-${i}`,
        key: f.key ?? slugifyLabel(f.label ?? `field-${i}`),
        label: f.label ?? "",
        type: f.type ?? "text",
        locked: false,
        required: Boolean(f.required),
      })) ?? [];

  const lockedFields: BuilderField[] = LOCKED_FIELDS.map((f) => ({
    ...f,
    id: `locked-${f.key}`,
    locked: true,
    required: f.required ?? true,
  }));

  const fallbackFields: BuilderField[] =
    schema == null
      ? [
          {
            id: "default-comment",
            key: "comment",
            label: "コメント",
            type: "textarea",
            locked: false,
            required: false,
          },
        ]
      : [];

  return [...lockedFields, ...fallbackFields, ...customFields];
}

function prepareFieldsPayload(fields: BuilderField[]): FormFieldDefinition[] {
  const used = new Set<string>();
  return fields.map((f) => {
    const base = f.locked ? f.key : slugifyLabel(f.label || `field-${f.id}`);
    let key = base || `field-${f.id}`;
    let n = 2;
    while (used.has(key)) key = `${base}_${n++}`;
    used.add(key);
    return {
      key,
      label: f.label || (f.locked ? f.label : "新しい質問"),
      type: f.type ?? (f.locked && f.key === "rating" ? "rating" : "text"),
      required: f.required,
    };
  });
}

/* ---------- Sortable Field Card ---------- */
function SortableFieldCard(props: {
  field: BuilderField;
  isEditing: boolean;
  onStartEdit: (id: string) => void;
  onFinishEdit: (id: string, label: string) => void;
  onRemove: (id: string) => void;
  onToggleRequired: (id: string) => void;
}) {
  const { field, isEditing, onStartEdit, onFinishEdit, onRemove, onToggleRequired } = props;
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
    id: field.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="group rounded-3xl border border-slate-200 bg-white px-5 py-4 shadow-sm transition hover:border-slate-300"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          {/* Drag handle */}
          <button
            className="cursor-grab text-slate-300 hover:text-slate-500 focus-visible:outline-none"
            aria-label="ドラッグで並び替え"
            {...attributes}
            {...listeners}
          >
            ☰
          </button>

          <div className="flex flex-1 flex-col gap-2">
            {field.locked ? (
              <p className="text-sm font-semibold text-slate-900">{field.label}</p>
            ) : isEditing ? (
              <input
                type="text"
                defaultValue={field.label}
                autoFocus
                onBlur={(e) => onFinishEdit(field.id, e.currentTarget.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.currentTarget.blur(); // onBlurで確定→入力欄を閉じる
                  } else if (e.key === "Escape") {
                    onFinishEdit(field.id, field.label || "");
                  }
                }}
                placeholder="質問文を入力"
                className="w-full rounded-2xl border border-slate-200 px-4 py-2 text-sm text-slate-900 shadow-sm focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-100"
              />
            ) : (
              <button
                type="button"
                onClick={() => onStartEdit(field.id)}
                className="text-left text-sm font-semibold text-slate-900"
                aria-label="質問文を編集"
              >
                {field.label || "新しい質問"}
              </button>
            )}

            <div className="flex items-center gap-3 text-xs text-slate-500">
              <span className="font-semibold uppercase tracking-[0.3em]">必須</span>
              <span className="text-xs font-semibold text-slate-700">
                {field.required ? "オン" : "オフ"}
              </span>
              <button
                type="button"
                onClick={() => {
                  if (!field.locked) onToggleRequired(field.id);
                }}
                disabled={field.locked}
                aria-pressed={field.required}
                aria-label="必須設定を切り替え"
                aria-disabled={field.locked}
                className={cn(
                  "relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-500",
                  field.locked
                    ? "bg-slate-200 opacity-70 cursor-not-allowed"
                    : field.required
                    ? "bg-sky-500"
                    : "bg-slate-200"
                )}
              >
                <span
                  className={cn(
                    "pointer-events-none absolute left-1 top-1 h-4 w-4 rounded-full bg-white shadow-sm transition-transform",
                    field.required ? "translate-x-5" : "translate-x-0"
                  )}
                />
              </button>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-end gap-2">
          {field.locked ? (
            <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-semibold text-slate-500">
              固定
            </span>
          ) : (
            <button
              type="button"
              onClick={() => onRemove(field.id)}
              className="inline-flex items-center gap-1 rounded-full border border-rose-200 bg-rose-50 px-3 py-1 text-xs font-semibold text-rose-600 transition hover:bg-rose-100"
              aria-label="この質問を削除"
            >
              削除
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

/* ---------- Hover Spacer (normally tight) ---------- */
function SpacerInsert({ onInsert }: { onInsert: () => void }) {
  return (
    <div className="relative h-0 overflow-visible transition-all duration-150 ease-out group-hover:h-12">
      <div className="pointer-events-none absolute inset-0 -translate-y-1/2 opacity-0 transition-opacity duration-150 ease-out group-hover:opacity-100 group-hover:pointer-events-auto">
        <div className="flex justify-center">
          <button
            type="button"
            onClick={onInsert}
            className={cn(
              "inline-flex items-center gap-2 rounded-full border border-dashed border-slate-300 bg-white/95 px-4 py-2",
              "text-sm font-semibold text-slate-500 hover:border-slate-400 hover:text-slate-900",
              "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-500"
            )}
            aria-label="ここに質問を追加"
          >
            <span className="text-lg leading-none">＋</span>
            <span>ここに追加</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default function FormBuilderClient({ company }: FormBuilderProps) {
  const router = useRouter();
  const [fields, setFields] = useState(() => createInitialFields(company.form_schema));
  const [editingId, setEditingId] = useState<string | null>(() =>
    // 新規（空ラベル）のみ初回編集状態に
    fields.find((f) => !f.locked && !f.label)?.id ?? null
  );
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSaved, setIsSaved] = useState(false);
  const [isPending, startTransition] = useTransition();

  const isEmpty = fields.length === 0;

  // dnd sensors
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(TouchSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const ids = useMemo(() => fields.map((f) => f.id), [fields]);

  const insertFieldAt = (index: number) => {
    const nf: BuilderField = {
      id: `custom-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      key: "",
      label: "",
      type: "text",
      locked: false,
      required: false,
    };
    setFields((prev) => {
      const next = [...prev];
      next.splice(index, 0, nf);
      return next;
    });
    setEditingId(nf.id);
    setIsSaved(false);
  };

  const onStartEdit = (id: string) => setEditingId(id);

  const onFinishEdit = (id: string, label: string) => {
    setFields((prev) =>
      prev.map((f) => (f.id === id ? { ...f, label: label.trim() } : f))
    );
    setEditingId(null);
    setIsSaved(false);
  };

  const onRemove = (id: string) => {
    setFields((prev) => prev.filter((f) => f.id !== id));
    if (editingId === id) setEditingId(null);
    setIsSaved(false);
  };

  const toggleRequired = (id: string) => {
    setFields((prev) =>
      prev.map((f) =>
        f.id === id && !f.locked ? { ...f, required: !f.required } : f
      )
    );
    setIsSaved(false);
  };

  const onDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIdx = fields.findIndex((f) => f.id === String(active.id));
    const newIdx = fields.findIndex((f) => f.id === String(over.id));
    setFields((prev) => arrayMove(prev, oldIdx, newIdx));
    setIsSaved(false);
  };

  const handleSave = () => {
    setErrorMessage(null);
    startTransition(async () => {
      const payloadFields = prepareFieldsPayload(fields);
      try {
        const res = await fetch("/api/companies/form-schema", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ companyId: company.id, fields: payloadFields }),
        });
        const body = await res.json().catch(() => null);
        if (!res.ok) throw new Error(body?.error || "保存に失敗しました。");
        setIsSaved(true);
        router.push("/dashboard");
      } catch (e) {
        setErrorMessage(e instanceof Error ? e.message : "保存に失敗しました。");
      }
    });
  };

  // 末尾追加ショートカット
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === "Enter") insertFieldAt(fields.length);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [fields.length]);

  return (
    <main className="min-h-screen bg-slate-50 py-12">
      <div className="mx-auto flex max-w-5xl flex-col gap-6 px-4 sm:px-6 lg:px-8">
        <header className="flex flex-col gap-3 rounded-3xl border border-slate-100 bg-white/90 p-6 shadow-sm shadow-sky-100">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-sky-500">
                フォームビルダー
              </p>
              <h1 className="text-2xl font-bold text-slate-900">{company.name}</h1>
            </div>
            <Link
              href="/dashboard"
              className="inline-flex items-center justify-center rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 transition hover:border-slate-300 hover:text-slate-900"
            >
              ダッシュボードへ戻る
            </Link>
          </div>
          <p className="text-xs text-slate-500">
            カード間は通常詰めています。カーソルを置くと間隔が広がり「ここに追加」が表示されます。
          </p>
        </header>

        <section>
          <p className="mb-3 text-sm font-semibold text-slate-700">質問の並び</p>

          {isEmpty ? (
            <div className="flex flex-col items-center justify-center rounded-3xl border border-slate-200 bg-white/80 py-14">
              <p className="mb-4 text-sm text-slate-500">まだ質問がありません。</p>
              <button
                type="button"
                onClick={() => insertFieldAt(0)}
                className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:border-slate-400 hover:text-slate-900"
              >
                ＋ 質問を追加
              </button>
            </div>
          ) : (
            <DndContext sensors={sensors} onDragEnd={onDragEnd}>
              <SortableContext items={ids} strategy={verticalListSortingStrategy}>
                <div className="space-y-0">
                  {fields.map((field, index) => (
                    <div key={field.id} className="group">
                      <SpacerInsert onInsert={() => insertFieldAt(index)} />
                      <SortableFieldCard
                        field={field}
                        isEditing={editingId === field.id}
                        onStartEdit={onStartEdit}
                        onFinishEdit={onFinishEdit}
                        onRemove={onRemove}
                        onToggleRequired={toggleRequired}
                      />
                    </div>
                  ))}
                  <div className="group">
                    <SpacerInsert onInsert={() => insertFieldAt(fields.length)} />
                  </div>
                </div>
              </SortableContext>
            </DndContext>
          )}
        </section>

        {/* 下部白カードは排除。ボタン中央揃えのみ。 */}
        {errorMessage && (
          <p className="text-center text-sm font-medium text-rose-600" role="alert">
            {errorMessage}
          </p>
        )}
        {isSaved && (
          <p className="text-center text-sm font-medium text-emerald-700" role="status">
            保存しました。
          </p>
        )}
        <div className="flex justify-center">
          <button
            type="button"
            onClick={handleSave}
            disabled={isPending}
            className={cn(
              "inline-flex items-center justify-center rounded-full px-5 py-2 text-sm font-semibold text-white shadow-sm transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-500",
              isPending ? "cursor-not-allowed bg-slate-300" : "bg-sky-500 hover:bg-sky-600"
            )}
          >
            {isPending ? "保存中..." : "保存"}
          </button>
        </div>
      </div>
    </main>
  );
}

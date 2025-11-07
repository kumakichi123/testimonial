"use client";

import React, { useState } from "react";

export type TestimonialItem = {
  id: string;
  title?: string | null;
  body?: string | null;
  name?: string | null;
  date?: string | null;
  rating?: number | null;
};

const MAX_RATING = 5;
const STAR_SOURCE = "★★★★★";

function clampRating(value?: number | null) {
  if (typeof value !== "number" || Number.isNaN(value)) {
    return 0;
  }
  return Math.max(0, Math.min(MAX_RATING, Math.round(value)));
}

function Stars({ rating = 0 }: { rating?: number | null }) {
  const safe = clampRating(rating);
  const filled = STAR_SOURCE.slice(0, safe);
  const empty = STAR_SOURCE.slice(safe, MAX_RATING);

  return (
    <span aria-label={`${safe} / ${MAX_RATING}`} className="inline-flex items-center text-sm font-semibold text-amber-500">
      <span>{filled}</span>
      {empty ? <span className="text-slate-300">{empty}</span> : null}
    </span>
  );
}

function Card({ item }: { item: TestimonialItem }) {
  const [expanded, setExpanded] = useState(false);
  const title = item.title?.trim() || "タイトル未設定";
  const body = item.body?.trim() || "本文がまだ入力されていません。";
  const name = item.name?.trim() || "匿名";
  const date = item.date?.trim();
  const rating = item.rating;

  return (
    <article
      className="flex h-full flex-col justify-between rounded-3xl border border-transparent bg-white/90 p-6 shadow-lg shadow-sky-100 transition duration-200 ease-out hover:-translate-y-1 hover:shadow-xl"
      aria-labelledby={`testimonial-${item.id}`}
    >
      <div>
        <header className="mb-3">
          <h3 id={`testimonial-${item.id}`} className="text-lg font-semibold leading-tight text-slate-900">
            {title}
          </h3>
          <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-slate-500">
            <span>{name}</span>
            {date ? <span className="text-slate-400">/ {date}</span> : null}
            {typeof rating === "number" ? (
              <span className="ml-auto inline-flex items-center gap-1 text-amber-500">
                <Stars rating={rating} />
              </span>
            ) : null}
          </div>
        </header>

        <p className={`text-sm leading-6 text-slate-700 ${expanded ? "" : "line-clamp-4"}`}>
          {body}
        </p>
      </div>

      <button
        className="mt-3 w-fit rounded-full bg-sky-50 px-3 py-1 text-xs font-medium text-sky-700 transition hover:bg-sky-100"
        onClick={() => setExpanded((prev) => !prev)}
        aria-expanded={expanded}
      >
        {expanded ? "閉じる" : "続きを読む"}
      </button>
    </article>
  );
}

export default function TestimonialWidget({ items }: { items: TestimonialItem[] }) {
  const safeItems = items ?? [];

  return (
    <div className="bg-gradient-to-br from-sky-50 via-white to-emerald-50/60 px-4 py-6 sm:px-6">
      <div className="mx-auto max-w-5xl space-y-6">
        <div className="rounded-3xl bg-white/80 px-6 py-4 text-center shadow-sm shadow-sky-100">
          <p className="text-xs uppercase tracking-[0.2em] text-sky-500">TESTIMONIALS</p>
          <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">お客様の声</h2>
        </div>

        {!safeItems.length ? (
          <div className="rounded-3xl border border-dashed border-slate-200 bg-white/70 p-12 text-center text-sm text-slate-500 shadow-inner">
            まだ公開中の声がありません。
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-2 xl:gap-6">
            {safeItems.map((item) => (
              <Card key={item.id} item={item} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

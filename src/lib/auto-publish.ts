import type { SupabaseClient } from "@supabase/supabase-js";

export type AutoPublishOutcome =
  | { kind: "error"; error: string }
  | { kind: "empty" }
  | { kind: "none" }
  | { kind: "updated"; updated: number };

export async function autoPublishHighRatingTestimonials(
  supabase: SupabaseClient,
  companyId: string
): Promise<AutoPublishOutcome> {
  const { data: testimonials, error: testimonialsError } = await supabase
    .from("testimonials")
    .select("id, is_public, response_id")
    .eq("company_id", companyId);

  if (testimonialsError) {
    return { kind: "error", error: testimonialsError.message };
  }

  if (!testimonials || testimonials.length === 0) {
    return { kind: "empty" };
  }

  const responseIds = testimonials
    .map((testimonial) => testimonial.response_id)
    .filter(
      (value): value is string =>
        typeof value === "string" && value.length > 0
    );

  if (!responseIds.length) {
    return { kind: "empty" };
  }

  const { data: responses, error: responsesError } = await supabase
    .from("responses")
    .select("id, rating")
    .in("id", responseIds);

  if (responsesError) {
    return { kind: "error", error: responsesError.message };
  }

  const ratingMap = new Map<string, number>();
  for (const response of responses ?? []) {
    if (typeof response.rating === "number") {
      ratingMap.set(response.id, response.rating);
    }
  }

  const publishIds = testimonials
    .filter((testimonial) => {
      const rating = testimonial.response_id
        ? ratingMap.get(testimonial.response_id)
        : undefined;
      return (
        typeof rating === "number" &&
        rating >= 4 &&
        (testimonial.is_public === false || testimonial.is_public === null)
      );
    })
    .map((testimonial) => testimonial.id);

  if (!publishIds.length) {
    return { kind: "none" };
  }

  const { error: updateError } = await supabase
    .from("testimonials")
    .update({
      is_public: true,
      published_at: new Date().toISOString(),
    })
    .in("id", publishIds);

  if (updateError) {
    return { kind: "error", error: updateError.message };
  }

  return { kind: "updated", updated: publishIds.length };
}

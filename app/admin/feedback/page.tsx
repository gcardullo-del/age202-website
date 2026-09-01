import {
   Lightbulb,
  MessageSquareText,
  Sparkles,
  Star,
} from "lucide-react";

import AdminShell from "@/components/admin/AdminShell";
import AdminFeedbackManager, {
  type AdminFeedbackItem,
} from "@/components/admin/AdminFeedbackManager";

import {
  prisma,
} from "@/lib/prisma";

export default async function AdminFeedbackPage() {
  const feedback =
    await prisma.feedback.findMany({
      orderBy: {
        createdAt:
          "desc",
      },
    });

  const totalFeedback =
    feedback.length;

  const newFeedback =
    feedback.filter(
      (item) =>
        item.status ===
        "NEW",
    ).length;

  const ideaFeedback =
    feedback.filter(
      (item) =>
        item.category ===
        "IDEA",
    ).length;

  const averageRating =
    totalFeedback > 0
      ? feedback.reduce(
          (
            total,
            item,
          ) =>
            total +
            item.rating,
          0,
        ) /
        totalFeedback
      : 0;

  const serializedFeedback: AdminFeedbackItem[] =
    feedback.map(
      (item) => ({
        id:
          item.id,

        rating:
          item.rating,

        category:
          item.category,

        message:
          item.message,

        sourcePath:
          item.sourcePath,

        status:
          item.status,

        createdAt:
          item.createdAt.toISOString(),

        updatedAt:
          item.updatedAt.toISOString(),
      }),
    );

  return (
    <AdminShell
      title="Feedback"
      description="Opinioni e suggerimenti privati inviati dai visitatori del museo digitale AGE202."
    >
      <div className="w-full">
        <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.3em] text-[#c8ff00]">
              Visitor insights
            </p>

            <h2 className="mt-2 text-3xl font-semibold tracking-[-0.04em] text-white sm:text-4xl">
              Museum feedback
            </h2>

            <p className="mt-3 max-w-2xl text-sm leading-7 text-white/45">
              Valutazioni, idee e suggerimenti
              raccolti privatamente dalla Home.
            </p>
          </div>

          <div className="flex items-center gap-3 self-start rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-xs uppercase tracking-[0.18em] text-white/40 lg:self-auto">
            <MessageSquareText className="h-4 w-4" />

            {totalFeedback} feedback
            {" · "}
            {newFeedback} new
          </div>
        </div>

        <section className="mb-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-[24px] border border-white/10 bg-white/[0.025] p-6">
            <div className="flex items-center justify-between">
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-white/35">
                Average rating
              </p>

              <Star className="h-5 w-5 fill-[#c8ff00] text-[#c8ff00]" />
            </div>

            <p className="mt-5 text-3xl font-semibold text-white">
              {totalFeedback > 0
                ? averageRating.toFixed(1)
                : "—"}

              {totalFeedback > 0 ? (
                <span className="ml-1 text-base font-normal text-white/30">
                  / 5
                </span>
              ) : null}
            </p>
          </div>

          <div className="rounded-[24px] border border-white/10 bg-white/[0.025] p-6">
            <div className="flex items-center justify-between">
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-white/35">
                Total feedback
              </p>

              <MessageSquareText className="h-5 w-5 text-white/45" />
            </div>

            <p className="mt-5 text-3xl font-semibold text-white">
              {totalFeedback}
            </p>
          </div>

          <div className="rounded-[24px] border border-white/10 bg-white/[0.025] p-6">
            <div className="flex items-center justify-between">
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-white/35">
                New
              </p>

              <Sparkles className="h-5 w-5 text-[#c8ff00]" />
            </div>

            <p className="mt-5 text-3xl font-semibold text-white">
              {newFeedback}
            </p>
          </div>

          <div className="rounded-[24px] border border-white/10 bg-white/[0.025] p-6">
            <div className="flex items-center justify-between">
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-white/35">
                Ideas
              </p>

              <Lightbulb className="h-5 w-5 text-amber-200" />
            </div>

            <p className="mt-5 text-3xl font-semibold text-white">
              {ideaFeedback}
            </p>
          </div>
        </section>

        <AdminFeedbackManager
          initialFeedback={
            serializedFeedback
          }
        />
      </div>
    </AdminShell>
  );
}

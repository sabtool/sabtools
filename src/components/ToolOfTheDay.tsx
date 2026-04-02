import Link from "next/link";
import { tools } from "@/lib/tools";

function getDayOfYear(): number {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  const diff = now.getTime() - start.getTime();
  const oneDay = 1000 * 60 * 60 * 24;
  return Math.floor(diff / oneDay);
}

export default function ToolOfTheDay() {
  const dayIndex = getDayOfYear() % tools.length;
  const tool = tools[dayIndex];

  return (
    <section className="my-8">
      <div className="relative rounded-2xl p-[2px] bg-gradient-to-r from-indigo-500 to-purple-500">
        <div className="rounded-2xl bg-white dark:bg-gray-900 p-5 sm:p-6">
          <div className="flex items-center gap-2 mb-3">
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950 px-3 py-1 rounded-full">
              <span aria-hidden="true">&#11088;</span> Tool of the Day
            </span>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900 dark:to-purple-900 flex items-center justify-center text-3xl shrink-0">
              {tool.icon}
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                {tool.name}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 leading-relaxed line-clamp-2">
                {tool.description}
              </p>
              <Link
                href={`/tools/${tool.slug}`}
                className="inline-flex items-center gap-1 mt-3 text-sm font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 transition"
              >
                Try Now
                <span aria-hidden="true">&rarr;</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

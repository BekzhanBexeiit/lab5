import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

type CourseCardProps = {
  id: string;
  title: string;
  description: string;
  credits: number;
  likes: number;
  category?: string;
};

const categoryColors: Record<string, string> = {
  Web:               "bg-sky-100 text-sky-700",
  Backend:           "bg-violet-100 text-violet-700",
  Database:          "bg-emerald-100 text-emerald-700",
  Security:          "bg-rose-100 text-rose-700",
  "AI / ML":         "bg-amber-100 text-amber-700",
  "CS Fundamentals": "bg-indigo-100 text-indigo-700",
  Mobile:            "bg-pink-100 text-pink-700",
  DevOps:            "bg-teal-100 text-teal-700",
};

export default function CourseCard({
  id,
  title,
  description,
  credits,
  likes,
  category,
}: CourseCardProps) {
  const badgeColor = category
    ? (categoryColors[category] ?? "bg-slate-100 text-slate-600")
    : null;

  return (
    <Link href={`/courses/${id}`} className="block h-full group">
      <Card className="h-full flex flex-col bg-white border border-slate-100 hover:border-sky-300 hover:shadow-lg hover:shadow-sky-100 transition-all duration-200 cursor-pointer rounded-2xl overflow-hidden">
        <CardHeader className="pb-2 pt-5 px-5">
          {/* Category badge */}
          {category && badgeColor && (
            <span
              className={`inline-block self-start text-xs font-semibold px-2.5 py-0.5 rounded-full mb-3 ${badgeColor}`}
            >
              {category}
            </span>
          )}

          <CardTitle className="text-[15px] font-bold text-slate-800 leading-snug group-hover:text-sky-600 transition-colors">
            {title}
          </CardTitle>
        </CardHeader>

        <CardContent className="flex flex-col flex-1 gap-0 pt-1 pb-4 px-5">
          <p className="text-[13px] text-slate-400 leading-relaxed flex-1 line-clamp-3 mb-4">
            {description}
          </p>

          {/* Bottom row */}
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1.5 bg-sky-50 text-sky-600 text-xs font-semibold px-3 py-1 rounded-full">
              🎓 {credits} credits
            </span>
            <Button
              variant="ghost"
              size="sm"
              className="flex items-center gap-1.5 text-rose-400 hover:text-rose-500 hover:bg-rose-50 text-xs font-semibold h-7 px-2 rounded-full"
            >
              ❤ {likes}
            </Button>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

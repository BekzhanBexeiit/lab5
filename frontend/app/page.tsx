import Link from "next/link";
import { getCourses } from "@/lib/courses";

export default async function HomePage() {
  const courses = await getCourses();

  const totalCredits = courses.reduce((sum, c) => sum + c.credits, 0);
  const totalLikes = courses.reduce((sum, c) => sum + c.likes, 0);
  const totalCourses = courses.length;

  // Collect unique tags from titles (simulated categories)
  const tags = ["Web", "Backend", "CS Fundamentals", "Mobile", "DevOps"];

  return (
    <div className="flex flex-col items-center">
      {/* Hero section */}
      <div className="text-center max-w-2xl mx-auto pt-10 pb-12">
        <span className="inline-block bg-sky-100 text-sky-600 text-xs font-semibold px-3 py-1 rounded-full mb-4 tracking-wide uppercase">
          Advanced Web Technologies · Lab 2
        </span>

        <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-800 mb-4 leading-tight">
          Welcome to{" "}
          <span className="text-sky-500">Course Catalog</span>
        </h1>

        <p className="text-slate-500 text-lg mb-8 leading-relaxed">
          Browse our collection of technology courses. Learn web development,
          databases, algorithms, mobile apps, and cloud computing — all in one
          place.
        </p>

        <div className="flex flex-wrap justify-center gap-3">
          <Link
            href="/courses"
            className="bg-sky-500 hover:bg-sky-600 text-white font-semibold px-6 py-3 rounded-full shadow-md shadow-sky-200 transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5"
          >
            Browse Courses →
          </Link>
          <Link
            href="/about"
            className="bg-white hover:bg-sky-50 text-slate-700 font-semibold px-6 py-3 rounded-full border border-sky-200 shadow-sm transition-all duration-200 hover:-translate-y-0.5"
          >
            About
          </Link>
        </div>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full max-w-2xl mb-10">
        <div className="bg-white rounded-2xl border border-sky-100 shadow-sm p-6 flex flex-col items-center gap-1 hover:shadow-md transition-shadow">
          <span className="text-3xl mb-1">📚</span>
          <span className="text-3xl font-bold text-slate-800">{totalCourses}</span>
          <span className="text-sm text-slate-500 font-medium">Courses</span>
        </div>

        <div className="bg-white rounded-2xl border border-sky-100 shadow-sm p-6 flex flex-col items-center gap-1 hover:shadow-md transition-shadow">
          <span className="text-3xl mb-1">🎓</span>
          <span className="text-3xl font-bold text-slate-800">{totalCredits}</span>
          <span className="text-sm text-slate-500 font-medium">Total Credits</span>
        </div>

        <div className="bg-white rounded-2xl border border-sky-100 shadow-sm p-6 flex flex-col items-center gap-1 hover:shadow-md transition-shadow">
          <span className="text-3xl mb-1">❤️</span>
          <span className="text-3xl font-bold text-slate-800">{totalLikes}</span>
          <span className="text-sm text-slate-500 font-medium">Total Likes</span>
        </div>
      </div>

      {/* Tags */}
      <div className="flex flex-wrap justify-center gap-2 pb-10">
        {tags.map((tag) => (
          <span
            key={tag}
            className="bg-white border border-sky-200 text-sky-600 text-xs font-medium px-4 py-1.5 rounded-full hover:bg-sky-50 transition-colors cursor-default"
          >
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
}

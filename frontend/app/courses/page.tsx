import { getCourses } from "@/lib/courses";
import CourseCard from "@/components/CourseCard";

// /courses беті — барлық курстар картамен көрсетіледі
// Server Component — Next.js сервері backend-тен деректер алады
export default async function CoursesPage() {
  const courses = await getCourses(); // Backend-тен GET /courses

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800 mb-1">All Courses</h1>
        <p className="text-slate-500 text-sm">
          {courses.length} courses available — click any card to see details.
        </p>
      </div>

      {/* Grid — экран кішірейсе бағандар азаяды */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {courses.map((course) => (
          <CourseCard key={course.id} {...course} />
        ))}
      </div>
    </div>
  );
}

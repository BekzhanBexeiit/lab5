import { notFound } from "next/navigation";
import { getCourse } from "@/lib/courses";
import LikeButton from "@/components/LikeButton";
import { EnrollForm } from "@/components/EnrollForm";

type Props = {
  params: Promise<{ id: string }>;
};

// /courses/[id] — жеке курс беті (мысалы /courses/web-security)
// Server Component — Next.js сервері деректер алады
export default async function CoursePage({ params }: Props) {
  const { id } = await params; // URL-ден id аламыз
  const course = await getCourse(id); // Backend-тен GET /courses/{id}

  // Курс табылмаса not-found.tsx беті көрінеді
  if (!course) {
    notFound();
  }

  return (
    <div className="max-w-2xl">
      <h1 className="text-3xl font-bold mb-4">{course.title}</h1>
      <p className="text-gray-600 text-lg mb-6">{course.description}</p>

      {/* Credits пен elective статусы */}
      <div className="flex items-center gap-4 mb-8">
        <span className="bg-blue-50 text-blue-700 px-4 py-2 rounded-full font-medium">
          {course.credits} credits
        </span>
        <span className="bg-gray-100 text-gray-600 px-4 py-2 rounded-full font-medium">
          {course.isElective ? "Elective" : "Required"}
        </span>
      </div>

      {/* Like батырмасы — Client Component (браузерде жұмыс істейді) */}
      <div className="border-t pt-6 mb-8">
        <p className="text-gray-500 mb-3 text-sm">Like this course?</p>
        <LikeButton courseId={course.id} initialLikes={course.likes} />
      </div>

      {/* Тіркелу формасы — Client Component */}
      <div className="border-t pt-6">
        <h2 className="text-xl font-semibold mb-4">Enroll in this course</h2>
        <EnrollForm courseId={course.id} />
      </div>
    </div>
  );
}

import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <h1 className="text-5xl font-bold text-gray-300 mb-4">404</h1>
      <h2 className="text-2xl font-semibold text-gray-700 mb-4">
        Course not found
      </h2>
      <p className="text-gray-500 mb-8">
        The course you are looking for does not exist or may have been removed.
      </p>
      <Link
        href="/courses"
        className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
      >
        Back to Courses
      </Link>
    </div>
  );
}

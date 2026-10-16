import Link from "next/link";

const techStack = [
  {
    icon: "🌸",
    name: "Tailwind CSS",
    desc: "Utility-first CSS framework for rapid UI development with responsive design built in.",
  },
  {
    icon: "✳️",
    name: "shadcn/ui",
    desc: "Beautifully designed components built with Radix UI and Tailwind CSS — copy, paste, customise.",
  },
  {
    icon: "⚡",
    name: "Next.js 15",
    desc: "React framework with App Router, Server Components, and file-based routing out of the box.",
  },
  {
    icon: "📱",
    name: "Responsive Design",
    desc: "Mobile-first grid: 1 column on phones, 2 on tablets, 3 on desktops — verified with DevTools.",
  },
];

const labDetails = [
  { label: "Course", value: "Advanced Web Technologies" },
  { label: "Lab", value: "Week 3 — Lab 2" },
  { label: "Goal", value: "Styling with Tailwind CSS and shadcn/ui" },
  { label: "Theme", value: "Sky-blue light design" },
];

export default function AboutPage() {
  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="text-center mb-10">
        <h1 className="text-4xl font-extrabold text-slate-800 mb-3">
          About This Lab
        </h1>
        <p className="text-slate-500 text-base leading-relaxed">
          Lab 2 of Advanced Web Technologies — styling a course catalog with
          Tailwind CSS and shadcn/ui. No new logic, only the look of an
          already-working project.
        </p>
      </div>

      {/* Tech Stack */}
      <h2 className="text-lg font-bold text-sky-600 mb-4">Tech Stack</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
        {techStack.map((item) => (
          <div
            key={item.name}
            className="bg-white border border-sky-100 rounded-2xl p-5 hover:shadow-md hover:border-sky-200 transition-all"
          >
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xl">{item.icon}</span>
              <span className="font-semibold text-slate-700 text-sm">
                {item.name}
              </span>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">{item.desc}</p>
          </div>
        ))}
      </div>

      {/* Lab Details */}
      <div className="bg-white border border-sky-100 rounded-2xl p-6 mb-8">
        <h2 className="text-sm font-bold text-slate-700 mb-4">Lab Details</h2>
        <div className="flex flex-col gap-2">
          {labDetails.map(({ label, value }) => (
            <div key={label} className="flex gap-2 text-sm">
              <span className="text-slate-400 w-16 shrink-0">{label}:</span>
              <span className="text-sky-600 font-medium">{value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="text-center">
        <Link
          href="/courses"
          className="inline-block bg-sky-500 hover:bg-sky-600 text-white font-semibold px-8 py-3 rounded-full shadow-md shadow-sky-200 transition-all duration-200 hover:-translate-y-0.5"
        >
          View All Courses →
        </Link>
      </div>
    </div>
  );
}

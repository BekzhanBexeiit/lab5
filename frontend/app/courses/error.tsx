"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

// Backend өшіп тұрса немесе қате болса көрінеді
// "Try again" басса қайта сұраныс жібереді
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error); // Қатені консольге шығарады
  }, [error]);

  const router = useRouter();

  function handleRetry() {
    router.refresh(); // Бетті жаңартады
    reset(); // Error күйін тазалайды
  }

  return (
    <main className="p-6">
      <h1 className="mb-2 text-2xl font-bold">Something went wrong</h1>
      <p className="mb-4 text-gray-600">
        Could not load the data. The backend may not be running.
      </p>
      <button
        onClick={handleRetry}
        className="rounded-md border border-slate-300 px-3 py-1 hover:bg-slate-50 transition-colors"
      >
        Try again
      </button>
    </main>
  );
}

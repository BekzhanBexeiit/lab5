"use client"; // Client Component — форма браузерде істейді

import { useState, type FormEvent } from "react";
import type { Enrollment } from "@/lib/courses";

const API = process.env.NEXT_PUBLIC_API_URL; // Браузерге жететін айнымалы

type EnrollFormProps = {
  courseId: string; // Қай курсқа тіркелу
};

type Status = "idle" | "sending" | "done" | "rejected" | "error";

// Курсқа тіркелу формасы — аты жазып Submit басасың
export function EnrollForm({ courseId }: EnrollFormProps) {
  const [studentName, setStudentName] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault(); // Беттің қайта жүктелуін тоқтатамыз
    setStatus("sending");
    try {
      // POST /enrollments — JSON body: { courseId, studentName }
      // Content-Type: application/json → браузер preflight OPTIONS жібереді алдымен
      const res = await fetch(`${API}/enrollments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ courseId, studentName }),
      });

      // 422 — backend деректерді қабылдамады (мысалы: атау 2 символдан кем)
      if (res.status === 422) {
        const body = await res.json();
        setMessage(body.detail[0].msg); // Қате себебі
        setStatus("rejected");
        return;
      }
      if (!res.ok) throw new Error(`API error: ${res.status}`);

      // 201 Created — сәтті! Backend id қайтарады (1, 2, 3...)
      const enrollment: Enrollment = await res.json();
      setMessage(`Enrollment number: ${enrollment.id}`);
      setStatus("done");
    } catch {
      setStatus("error"); // Backend өшіп тұрса немесе желі қатесі
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex max-w-sm flex-col gap-2">
      <label htmlFor="studentName">Your name</label>
      <input
        id="studentName"
        value={studentName}
        onChange={(e) => setStudentName(e.target.value)}
        className="rounded-md border border-slate-300 px-3 py-2"
      />
      <button
        type="submit"
        disabled={status === "sending"}
        className="rounded-md border border-slate-300 px-3 py-2 hover:bg-slate-50 transition-colors disabled:opacity-50"
      >
        Enroll
      </button>
      {/* Статус хабарламалары */}
      {status === "done" && (
        <p className="text-green-700">You are enrolled. {message}</p>
      )}
      {status === "rejected" && (
        <p className="text-red-600">The server rejected the data: {message}</p>
      )}
      {status === "error" && (
        <p className="text-red-600">Could not submit the enrollment</p>
      )}
    </form>
  );
}

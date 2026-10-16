"use client"; // Браузерде жұмыс істейді — форма, useState керек

import { useState, type FormEvent } from "react";
import type { Enrollment } from "@/lib/courses";

const API = process.env.NEXT_PUBLIC_API_URL;

type EnrollFormProps = {
  courseId: string; // қай курсқа тіркелу
};

// Форманың мүмкін күйлері
type Status = "idle" | "sending" | "done" | "rejected" | "error";

export function EnrollForm({ courseId }: EnrollFormProps) {
  const [studentName, setStudentName] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault(); // беттің қайта жүктелуін болдырмайды
    setStatus("sending");
    try {
      // POST /enrollments — JSON body жіберіледі
      // Content-Type: application/json болмаса backend 422 қатесін береді
      const res = await fetch(`${API}/enrollments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ courseId, studentName }),
      });

      if (res.status === 422) {
        // Backend деректерді қабылдамады (мысалы атау тым қысқа)
        // detail[0].msg-де себебі жазылған
        const body = await res.json();
        setMessage(body.detail[0].msg);
        setStatus("rejected");
        return;
      }
      if (!res.ok) throw new Error(`API error: ${res.status}`);

      // 201 Created — тіркелу сәтті, id-ді пайдаланушыға көрсетеміз
      const enrollment: Enrollment = await res.json();
      setMessage(`Enrollment number: ${enrollment.id}`);
      setStatus("done");
    } catch {
      setStatus("error");
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

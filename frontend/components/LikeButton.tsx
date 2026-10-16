"use client"; // Браузерде жұмыс істейді — onClick керек

import { useState } from "react";
import type { Course } from "@/lib/courses";

const API = process.env.NEXT_PUBLIC_API_URL;

type LikeButtonProps = {
  courseId: string;    // қай курсқа like басылды
  initialLikes: number; // backend-тен келген бастапқы сан
};

export default function LikeButton({ courseId, initialLikes }: LikeButtonProps) {
  const [likes, setLikes] = useState<number>(initialLikes);
  const [failed, setFailed] = useState(false);

  async function handleClick() {
    setFailed(false);
    try {
      // POST /courses/{courseId}/like — backend likes санын +1 арттырады
      const res = await fetch(`${API}/courses/${courseId}/like`, {
        method: "POST",
      });
      if (!res.ok) throw new Error(`API error: ${res.status}`);
      // Backend жаңартылған курсты қайтарады — одан жаңа likes санын аламыз
      const course: Course = await res.json();
      setLikes(course.likes); // likes + 1 емес, сервердің нақты санын қоямыз
    } catch {
      setFailed(true);
    }
  }

  return (
    <div>
      <button
        onClick={handleClick}
        className="flex items-center gap-2 bg-red-50 text-red-600 border border-red-200 px-5 py-2 rounded-lg hover:bg-red-100 transition-colors font-medium text-lg"
      >
        {likes}
      </button>
      {failed && (
        <p className="text-red-600 mt-2 text-sm">Failed to like the course</p>
      )}
    </div>
  );
}

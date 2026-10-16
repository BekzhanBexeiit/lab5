"use client"; // Бұл компонент браузерде жұмыс істейді (Client Component)

import { useState } from "react";
import useSWR from "swr"; // SWR — браузерден API-ға сұраныс жіберетін кітапхана
import type { Course } from "@/lib/courses"; // тек тип импортталады, модуль емес

// NEXT_PUBLIC_ префиксі бар айнымалы браузерге де жетеді
const API = process.env.NEXT_PUBLIC_API_URL;

// SWR-ге URL беріледі, fetcher сол URL-ден деректер алады
async function fetcher(url: string): Promise<Course[]> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return res.json();
}

export function ElectiveFilter() {
  // onlyElective — checkbox күйі (true/false)
  const [onlyElective, setOnlyElective] = useState(false);

  // Checkbox қосулы болса ?is_elective=true параметрін қосамыз
  const query = onlyElective ? "?is_elective=true" : "";

  // SWR query өзгергенде автоматты түрде қайта сұраныс жібереді
  const { data, error, isLoading } = useSWR(`${API}/courses${query}`, fetcher);

  return (
    <div>
      <label className="flex items-center gap-2 mb-4 cursor-pointer">
        <input
          type="checkbox"
          checked={onlyElective}
          onChange={(e) => setOnlyElective(e.target.checked)}
          className="w-4 h-4"
        />
        Electives only
      </label>
      {error && <p className="text-red-600">Failed to load courses</p>}
      {isLoading && <p className="text-gray-500">Loading…</p>}
      {data && (
        <ul className="list-disc pl-6 space-y-1">
          {data.map((c) => (
            <li key={c.id}>
              {c.title} — {c.credits} cr.
              {c.isElective && (
                <span className="text-blue-600 ml-1">· elective</span>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

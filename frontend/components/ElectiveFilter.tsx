"use client"; // Client Component — браузер тікелей API-ға сұраныс жібереді

import { useState } from "react";
import useSWR from "swr"; // SWR — деректерді жүктейтін кітапхана
import type { Course } from "@/lib/courses";

const API = process.env.NEXT_PUBLIC_API_URL; // Браузерге жететін айнымалы

// URL-ден деректер алатын функция
async function fetcher(url: string): Promise<Course[]> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return res.json();
}

// Checkbox бар сүзгі — белгілесең тек elective курстар шығады
export function ElectiveFilter() {
  const [onlyElective, setOnlyElective] = useState(false); // Checkbox күйі

  // Checkbox қосулы болса URL-ге ?is_elective=true қосамыз
  const query = onlyElective ? "?is_elective=true" : "";

  // SWR — query өзгергенде автоматты жаңа сұраныс жібереді
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

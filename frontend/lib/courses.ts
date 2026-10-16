// Курс типі — backend JSON-ымен сәйкес (camelCase)
export type Course = {
  id: string;
  title: string;
  description: string;
  credits: number;
  isElective: boolean;
  likes: number;
};

// Тіркелу типі — POST /enrollments жауабымен сәйкес
export type Enrollment = {
  id: number;
  courseId: string;
  studentName: string;
};

// API_URL тек сервер жағында жұмыс істейді (NEXT_PUBLIC_ жоқ)
// .env.local-да API_URL=http://localhost:8000 деп жазылған
const API_URL = process.env.API_URL;
if (!API_URL) throw new Error("API_URL is not set: create .env.local");

// Барлық курстарды backend-тен алады
// cache: "no-store" — бет әр жолы жаңа деректермен салынады (мұздамайды)
export async function getCourses(): Promise<Course[]> {
  const res = await fetch(`${API_URL}/courses`, { cache: "no-store" });
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return res.json();
}

// Бір курсты ID бойынша алады
// 404 → undefined (бет notFound() шақырады)
// Басқа қате → Error лақтырады (error.tsx ұстайды)
export async function getCourse(id: string): Promise<Course | undefined> {
  const res = await fetch(`${API_URL}/courses/${id}`, { cache: "no-store" });
  if (res.status === 404) return undefined;
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return res.json();
}

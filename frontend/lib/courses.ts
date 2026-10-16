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

// API_URL — Next.js сервері ғана көреді (.env.local файлынан)
// Браузерге жетпейді, сондықтан қауіпсіз
const API_URL = process.env.API_URL;
if (!API_URL) throw new Error("API_URL is not set: create .env.local");

// Backend-тен барлық курстарды алады (GET /courses)
// cache: "no-store" — әр сұраныста жаңа деректер алады
export async function getCourses(): Promise<Course[]> {
  const res = await fetch(`${API_URL}/courses`, { cache: "no-store" });
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return res.json();
}

// ID бойынша 1 курс алады (GET /courses/{id})
// 404 болса undefined қайтарады → notFound() беті шығады
export async function getCourse(id: string): Promise<Course | undefined> {
  const res = await fetch(`${API_URL}/courses/${id}`, { cache: "no-store" });
  if (res.status === 404) return undefined;
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return res.json();
}

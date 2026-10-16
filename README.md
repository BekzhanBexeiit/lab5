# Lab 5 — Next.js + FastAPI: CORS and the API Contract

> **Advanced Web Technologies** · Bekzhan Bexeiit

This lab connects a Next.js frontend with a FastAPI backend.
The browser makes direct requests to the API — CORS, camelCase JSON, a like button, and an enrollment form are all implemented.

---

## 📁 Project Structure

```
lab5/
├── backend/          # FastAPI — Python (based on Lab 4)
│   ├── main.py       # CORS, all routes
│   ├── models.py     # CamelModel, Course, Enrollment
│   ├── data.py       # 6 course records
│   └── requirements.txt
│
└── frontend/         # Next.js 15 — TypeScript (based on Lab 1)
    ├── app/
    │   ├── courses/          # /courses and /courses/[id] pages
    │   │   ├── error.tsx     # shown when backend is down
    │   │   └── [id]/page.tsx # course page + Like + Form
    │   └── filter/page.tsx   # Elective filter page
    ├── components/
    │   ├── ElectiveFilter.tsx # SWR — direct browser request
    │   ├── LikeButton.tsx    # POST /courses/{id}/like
    │   └── EnrollForm.tsx    # POST /enrollments
    └── lib/courses.ts        # getCourses, getCourse → fetches from API
```

---

## 🚀 Running the Project

**Start the backend first, then the frontend:**

```powershell
# Terminal 1 — Backend
cd backend
python -m venv .venv
.venv\Scripts\Activate.ps1
pip install -r requirements.txt
fastapi dev main.py
# → http://localhost:8000

# Terminal 2 — Frontend
cd frontend
npm install
# create .env.local (see below)
npm run dev
# → http://localhost:3000
```

---

## ⚙️ Environment Variables

Create a `frontend/.env.local` file:

```
API_URL=http://localhost:8000
NEXT_PUBLIC_API_URL=http://localhost:8000
```

- `API_URL` — used only by the Next.js server (Server Components)
- `NEXT_PUBLIC_API_URL` — also sent to the browser (Client Components)

`.env.local` is in `.gitignore` and will not be committed.

---

## 🌐 Pages

| URL | Description |
|---|---|
| http://localhost:3000/courses | 6 course cards (from backend) |
| http://localhost:3000/courses/web-security | Course page + ❤ + Enrollment form |
| http://localhost:3000/filter | Elective checkbox (SWR) |
| http://localhost:8000/docs | API Swagger documentation |

---

## 📡 API Routes

| Method | Path | Description |
|---|---|---|
| GET | `/courses` | Course list (filter, sort, pagination) |
| GET | `/courses/{id}` | Single course or 404 |
| POST | `/courses/{id}/like` | Like +1 |
| POST | `/enrollments` | Create enrollment → 201 |
| GET | `/enrollments` | List all enrollments |

---

## 🔑 Key Topics — Lab 5

**CORS** — when the browser makes a request from one origin (localhost:3000) to another (localhost:8000), the server must explicitly grant permission. `CORSMiddleware` allows only `http://localhost:3000`.

**camelCase JSON** — Python snake_case (`is_elective`) is automatically converted to camelCase (`isElective`) in JSON responses. TypeScript types match accordingly.

**Preflight (OPTIONS)** — when the enrollment form sends `Content-Type: application/json`, the browser first sends an OPTIONS request to check permissions. The like button sends a POST with no body and no custom headers — no preflight needed.

**Server vs Client requests** — the `/courses` page fetches data through the Next.js server (no CORS needed). ElectiveFilter, LikeButton, and EnrollForm fetch directly from the browser (CORS required).

---

## 📝 Decisions

**Why was `generateStaticParams` removed from `/courses/[id]`?**
`generateStaticParams` runs during `npm run build` and calls `getCourses()`, which makes an HTTP request to the backend. If the backend is not running at build time, the build fails. Removing it keeps the build self-contained and ensures each page always shows fresh data.

**Why does the like button need no preflight, but the enrollment form does?**
The like is a POST with no body and no custom headers — it qualifies as a "simple request" under the CORS spec. The enrollment form sends `Content-Type: application/json`, which triggers a preflight OPTIONS request before the actual POST.

---

## 🔴 Breakage Journal

### Breakage 1: CORS completely disabled
- **What I did:** commented out the entire `app.add_middleware(...)` block
- **Console:** `No 'Access-Control-Allow-Origin' header is present on the requested resource`
- **Network:** courses — red (CORS error), backend log shows 200 OK
- **Cause:** no CORS middleware — server executed the request but gave the browser no permission to read the response
- **How I found it:** Step 3 — no `access-control-allow-origin` header in response headers

### Breakage 2: Trailing slash in `allow_origins`
- **What I did:** changed `"http://localhost:3000"` to `"http://localhost:3000/"`
- **Console:** same error message
- **Network:** form OPTIONS → 400, POST was never sent
- **Cause:** `"http://localhost:3000/"` does not match any browser origin
- **How I found it:** Step 3 — header present but value did not match

### Breakage 3: `allow_methods` deleted
- **What I did:** deleted `allow_methods=["*"]` from `app.add_middleware`
- **Console:** `It does not have HTTP ok status`
- **Network:** /filter OK, Like OK, Form OPTIONS → 400
- **Cause:** only GET was allowed by default, POST was rejected
- **How I found it:** Step 2 — OPTIONS returned 400, confirmed with curl: `Disallowed CORS method`

### Breakage 4: Wrong origin — opened at `http://127.0.0.1:3000`
- **What I did:** opened the app at `http://127.0.0.1:3000/filter`
- **Console:** `from origin 'http://127.0.0.1:3000' has been blocked`
- **Network:** courses red, backend shows 200 OK
- **Cause:** `localhost` and `127.0.0.1` are different origins to the browser
- **How I found it:** Step 3 — Origin header showed `127.0.0.1:3000`, not in `allow_origins`

### Breakage 5: Python error looked like a CORS error
- **What I did:** changed `p["offset"]` to `p["ofset"]` (typo)
- **Console:** `No 'Access-Control-Allow-Origin' header` — looks like CORS!
- **Network:** courses red. Backend log: `500 Internal Server Error`, `KeyError: 'ofset'`
- **Cause:** an unhandled exception produces a 500 response outside `CORSMiddleware`, so it has no CORS headers
- **How I found it:** Step 5 — checked the FastAPI terminal and saw a traceback

---

## 📦 Tech Stack

- [Next.js 15](https://nextjs.org/) — App Router, Server Components
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [shadcn/ui](https://ui.shadcn.com/)
- [SWR](https://swr.vercel.app/) — client-side data fetching
- [FastAPI](https://fastapi.tiangolo.com/) — Python backend
- [Pydantic v2](https://docs.pydantic.dev/) — data validation and camelCase aliases

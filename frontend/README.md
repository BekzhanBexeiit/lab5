# Course Catalog

A course catalog web application built with **Next.js 15**, **TypeScript**, **Tailwind CSS**, and **shadcn/ui**.  
Connected to the **FastAPI** backend (Lab 4 / Lab 5).

**GitHub repositories:**
- Frontend (this project): https://github.com/BekzhanBexeiit/course-catalog
- Backend (API): https://github.com/BekzhanBexeiit/CC-API

---

## How to Run

Start the **backend first**, then the frontend:

```bash
# Terminal 1 — backend (course-catalog-api)
cd course-catalog-api
.venv\Scripts\Activate.ps1    # Windows
fastapi dev main.py

# Terminal 2 — frontend (this project)
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Environment Variables

Create a `.env.local` file in the project root (next to `package.json`):

```
API_URL=http://localhost:8000
NEXT_PUBLIC_API_URL=http://localhost:8000
```

- `API_URL` — used by Server Components (getCourses, getCourse). **Never exposed to the browser.**
- `NEXT_PUBLIC_API_URL` — used by Client Components (ElectiveFilter, LikeButton, EnrollForm). Embedded in the browser bundle.

`.env.local` is listed in `.gitignore` and will not be committed to git.

---

## What's implemented

- **Routes**: `/`, `/about`, `/courses`, `/courses/[id]`, `/filter`
- **Server Components**: `/courses` and `/courses/[id]` fetch data from the FastAPI backend
- **Client Components**: `ElectiveFilter` (SWR), `LikeButton` (POST), `EnrollForm` (POST with JSON body)
- **`loading.tsx`** — shown while the server component waits for the backend
- **`not-found.tsx`** — shown when the backend returns 404
- **`error.tsx`** — shown when the backend is unreachable; "Try again" refreshes the data
- **CORS**: configured in the backend for `http://localhost:3000`

---

## Build

```bash
npm run build   # backend does NOT need to be running
npm run start   # run the production build
```

`/courses` and `/courses/[id]` are marked `ƒ` (Dynamic) — they are server-rendered on every request thanks to `cache: "no-store"`.

---

## Decisions

**Why was `generateStaticParams` removed from `/courses/[id]`?**  
`generateStaticParams` runs during `npm run build` and calls `getCourses()`, which makes an HTTP request to the backend. If the backend is not running at build time, the build fails with `ECONNREFUSED`. Since the course list now lives in the backend and can change independently of a frontend deploy, pre-building those pages would also show stale data. Removing `generateStaticParams` keeps the build self-contained and makes each course page fetch fresh data on every request.

**Why does the like button need no preflight, but the enrollment form does?**  
The like is a POST with no body and no custom headers — it qualifies as a "simple request" under the CORS spec and goes straight to the server. The enrollment form sends `Content-Type: application/json`, which is not a CORS-safe header, so the browser sends an OPTIONS preflight first to ask the server for permission before the real POST.

---

## Breakage Journal

### Breakage 1: CORS entirely removed (commented out `app.add_middleware`)

- **What I did:** commented out the entire `app.add_middleware(CORSMiddleware, ...)` block
- **Console:** `Access to fetch at 'http://localhost:8000/courses' from origin 'http://localhost:3000' has been blocked by CORS policy: No 'Access-Control-Allow-Origin' header is present on the requested resource`
- **Network:** `/filter` → `courses` row is red (CORS error), but backend log shows `200 OK`. Like POST → same CORS error, but the like count incremented on the server. Form → `OPTIONS /enrollments` returned **405**, the POST was never sent.
- **Cause:** No `access-control-allow-origin` header in any response — CORS middleware is not attached. The server still executes requests; it just gives the browser no permission to read responses.
- **How I found it:** Step 3 of the algorithm — no `access-control-allow-origin` header in Response Headers. Step 2 for the form — OPTIONS returned 405 (no middleware = no OPTIONS handler).
- **Note:** `/courses` (Server Component) was unaffected — server-to-server requests don't go through the browser and don't need CORS.

---

### Breakage 2: Trailing slash in `allow_origins`

- **What I did:** changed `allow_origins=["http://localhost:3000"]` to `allow_origins=["http://localhost:3000/"]`
- **Console:** same `No 'Access-Control-Allow-Origin' header is present` message as Breakage 1
- **Network:** `/filter` → `courses` red. Form → `OPTIONS /enrollments` returned **400**, POST not sent. Console also showed: `Response to preflight request doesn't pass access control check: No 'Access-Control-Allow-Origin' header is present on the requested resource`
- **Cause:** The string `"http://localhost:3000/"` has a trailing slash and matches no browser origin. No request from `http://localhost:3000` is granted permission.
- **How I found it:** Step 3 — header present but value didn't match. Step 2 for the form — preflight got 400 (not 405 like in Breakage 1), so middleware is connected but the origin is wrong.

---

### Breakage 3: `allow_methods` line deleted entirely

- **What I did:** deleted `allow_methods=["*"]` from `app.add_middleware`
- **Console:** `/filter` worked fine. Like worked fine. Form: `Response to preflight request doesn't pass access control check: It does not have HTTP ok status`
- **Network:** `/filter` → `courses` 200 (OK). Like → `POST like` 200 (OK). Form → `OPTIONS /enrollments` **400**, POST not sent.
- **Cause:** Without `allow_methods`, only GET is allowed by default. The POST method is rejected by the preflight. The response to OPTIONS contained `access-control-allow-methods: GET` — that was the clue.
- **How I found it:** Step 3 — `access-control-allow-origin` was present (origin is allowed), so the issue is elsewhere. Step 2 — OPTIONS returned 400. Checked the preflight response body via `curl -X OPTIONS`: `Disallowed CORS method`.

---

### Breakage 4: Wrong origin — opened at `http://127.0.0.1:3000`

- **What I did:** added `allowedDevOrigins: ["127.0.0.1"]` to `next.config.ts`, restarted dev server, opened `http://127.0.0.1:3000/filter`
- **Console:** `Access to fetch at 'http://localhost:8000/courses' from origin 'http://127.0.0.1:3000' has been blocked by CORS policy: No 'Access-Control-Allow-Origin' header is present`
- **Network:** `courses` red, backend log shows `200 OK`
- **Cause:** `localhost` and `127.0.0.1` are different host strings — therefore different origins to the browser. Only `http://localhost:3000` is in `allow_origins`.
- **How I found it:** Step 3 — no `access-control-allow-origin` in response. The `Origin` header in the request showed `http://127.0.0.1:3000` — not matching the allowed list.

---

### Breakage 5: Python typo pretending to be a CORS error

- **What I did:** in `list_courses`, changed `p["offset"]` to `p["ofset"]` in the slice expression
- **Console on /filter:** `Access to fetch at 'http://localhost:8000/courses' from origin 'http://localhost:3000' has been blocked by CORS policy: No 'Access-Control-Allow-Origin' header is present` — looks like CORS!
- **Network:** `courses` red. Like and form: still worked fine.
- **Backend terminal:** `GET /courses HTTP/1.1" 500 Internal Server Error` + Python traceback: `KeyError: 'ofset'`
- **Cause:** An unhandled Python exception produces a 500 response via a layer outside `CORSMiddleware`, so the 500 response has no `access-control-*` headers. The browser sees a response without permission and reports a CORS error — but CORS is configured correctly.
- **How I found it:** Step 5 of the algorithm — checked the FastAPI terminal and saw a 500 + traceback. Also, `/courses` (Server Component) showed `error.tsx`, which doesn't happen for a CORS-only problem.

---

## Tech Stack

- [Next.js 15](https://nextjs.org/) — App Router
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [shadcn/ui](https://ui.shadcn.com/)
- [SWR](https://swr.vercel.app/) — client-side data fetching

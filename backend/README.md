# 📚 Course Catalog API

A REST API for a university course catalog, built with **FastAPI** and **Pydantic**.

**GitHub:** https://github.com/BekzhanBexeiit/CC-API

---

## 🚀 Quick Start

### 1. Create and activate a virtual environment

**Windows (PowerShell):**
```powershell
python -m venv .venv
.venv\Scripts\Activate.ps1
```

**macOS / Linux:**
```bash
python3 -m venv .venv
source .venv/bin/activate
```

### 2. Install dependencies

```bash
pip install -r requirements.txt
```

### 3. Start the development server

```bash
fastapi dev main.py
```

The server starts at **http://127.0.0.1:8000**

---

## 📖 Interactive Documentation

| URL | Description |
|-----|-------------|
| http://localhost:8000/docs | Swagger UI — try every endpoint |
| http://localhost:8000/redoc | ReDoc — readable reference |

---

## 🗺️ API Routes

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/` | Health check |
| `GET` | `/courses` | List with filtering, sorting, pagination |
| `GET` | `/courses/{course_id}` | Single course or 404 |
| `POST` | `/courses/{course_id}/like` | Increment like counter, returns updated course |
| `POST` | `/enrollments` | Create enrollment, returns record with id |
| `GET` | `/enrollments` | List all enrollments (in-memory) |

---

## 🔍 Query Parameters — `GET /courses`

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `is_elective` | `bool` | — | `true` → electives only |
| `sort` | `"popular"` \| `"title"` | `popular` | Sort by likes or alphabetically |
| `q` | `string` | — | Search by title (case-insensitive) |
| `page` | `int ≥ 1` | `1` | Page number |
| `page_size` | `int 1–100` | `20` | Items per page |

---

## 🔄 What changed in Lab 5

### CORS

`CORSMiddleware` is attached to the app with:

```python
allow_origins=["http://localhost:3000"]
allow_methods=["*"]
allow_headers=["*"]
```

**Why it is needed:** The Next.js frontend runs on `http://localhost:3000` and makes direct browser requests to `http://localhost:8000`. These are cross-origin requests — the browser blocks them unless the server explicitly grants permission via CORS headers. Without CORSMiddleware, the browser hides the responses from JavaScript even though the server executes the requests successfully.

Only `http://localhost:3000` is listed — other origins (e.g. `http://127.0.0.1:3000`) receive no `access-control-allow-origin` header and are blocked by the browser.

---

### camelCase JSON via `CamelModel`

All models inherit from `CamelModel`:

```python
class CamelModel(BaseModel):
    model_config = ConfigDict(
        alias_generator=to_camel,   # is_elective → isElective in JSON
        validate_by_name=True,      # data.py can still use Python field names
        validate_by_alias=True,     # clients can send camelCase too
    )
```

**Effect:** JSON keys are camelCase (`isElective`, `courseId`, `studentName`), but query parameters stay snake_case (`is_elective=true`) because aliases apply only to request/response bodies.

Example response from `GET /courses`:
```json
{
  "id": "ai-integration",
  "title": "AI/LLM Integration",
  "credits": 5,
  "isElective": true,
  "likes": 32
}
```

---

### New routes

**`POST /courses/{course_id}/like`**
Increments `likes` by 1 and returns the updated course.
```json
// POST /courses/web-security/like → 200
{
  "id": "web-security",
  "title": "Web Security Essentials",
  "credits": 4,
  "isElective": false,
  "likes": 22
}
// POST /courses/nope/like → 404
{"detail": "Course not found"}
```

**`POST /enrollments`** — body: `{"courseId": "web-security", "studentName": "Aigerim"}`
```json
// → 201
{"courseId": "web-security", "studentName": "Aigerim", "id": 1}

// studentName < 2 chars → 422
{"detail": [{"loc": ["body", "studentName"], "msg": "String should have at least 2 characters", ...}]}

// unknown courseId → 404
{"detail": "Course not found"}
```

**Note:** likes and enrollments are stored in memory and reset on every server restart. Persistent storage will be added in a later lab with PostgreSQL.

---

## 📦 Project Structure

```
backend/
├── main.py       # FastAPI app, CORS, all routes
├── models.py     # CamelModel, Course, EnrollmentIn, Enrollment
├── data.py       # 6 courses + get_all_courses / find_course
└── requirements.txt
```

---

## 🛠️ Tech Stack

- **[FastAPI](https://fastapi.tiangolo.com/)** — async web framework
- **[Pydantic v2](https://docs.pydantic.dev/)** — data validation and camelCase aliases
- **[Uvicorn](https://www.uvicorn.org/)** — ASGI server

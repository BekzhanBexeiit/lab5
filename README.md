# Lab 5 — Next.js + FastAPI: CORS and the API Contract

> **Advanced Web Technologies** · Bekzhan Bexeiit

Бұл лабораторияда Next.js frontend пен FastAPI backend-і байланыстырылады.
Браузер тікелей API-ға сұраныс жібереді — CORS, camelCase JSON, like батырмасы және тіркелу формасы іске асырылған.

---

## 📁 Жоба құрылымы

```
lab5/
├── backend/          # FastAPI — Python (Лаб 4 негізінде)
│   ├── main.py       # CORS, барлық роутлар
│   ├── models.py     # CamelModel, Course, Enrollment
│   ├── data.py       # 6 курс деректері
│   └── requirements.txt
│
└── frontend/         # Next.js 15 — TypeScript (Лаб 1 негізінде)
    ├── app/
    │   ├── courses/          # /courses және /courses/[id] беттері
    │   │   ├── error.tsx     # backend өшсе көрінеді
    │   │   └── [id]/page.tsx # курс беті + Like + Форма
    │   └── filter/page.tsx   # Elective сүзгісі беті
    ├── components/
    │   ├── ElectiveFilter.tsx # SWR — браузерден тікелей сұраныс
    │   ├── LikeButton.tsx    # POST /courses/{id}/like
    │   └── EnrollForm.tsx    # POST /enrollments
    └── lib/courses.ts        # getCourses, getCourse → API-дан алады
```

---

## 🚀 Іске қосу

**Backend алдымен, Frontend кейін:**

```powershell
# Терминал 1 — Backend
cd backend
python -m venv .venv
.venv\Scripts\Activate.ps1
pip install -r requirements.txt
fastapi dev main.py
# → http://localhost:8000

# Терминал 2 — Frontend
cd frontend
npm install
# .env.local файлын жасаңыз (төменде)
npm run dev
# → http://localhost:3000
```

---

## ⚙️ Орта айнымалылары

`frontend/.env.local` файлын жасаңыз:

```
API_URL=http://localhost:8000
NEXT_PUBLIC_API_URL=http://localhost:8000
```

- `API_URL` — тек Next.js сервері қолданады (Server Components)
- `NEXT_PUBLIC_API_URL` — браузерге де жетеді (Client Components)

`.env.local` файлы `.gitignore`-да — репозиторийге кірмейді.

---

## 🌐 Беттер

| Адрес | Не көрінеді |
|---|---|
| http://localhost:3000/courses | 6 курс картасы (backend-тен) |
| http://localhost:3000/courses/web-security | Курс беті + ❤ + Тіркелу формасы |
| http://localhost:3000/filter | Elective checkbox (SWR) |
| http://localhost:8000/docs | API Swagger документациясы |

---

## 📡 API Роутлары

| Метод | Адрес | Не істейді |
|---|---|---|
| GET | `/courses` | Курстар тізімі (сүзгі, сорт, беттеу) |
| GET | `/courses/{id}` | Бір курс немесе 404 |
| POST | `/courses/{id}/like` | Like +1 |
| POST | `/enrollments` | Тіркелу жасайды → 201 |
| GET | `/enrollments` | Тіркелулер тізімі |

---

## 🔑 Лаб 5 негізгі тақырыптары

**CORS** — браузер басқа origin-нан (localhost:3000 → localhost:8000) сұраныс жібергенде сервер рұқсат беруі керек. `CORSMiddleware` тек `http://localhost:3000`-ге рұқсат береді.

**camelCase JSON** — Python snake_case (`is_elective`) автоматты түрде JSON camelCase-ке (`isElective`) ауысады. TypeScript типтері сәйкес келеді.

**Preflight (OPTIONS)** — форма `Content-Type: application/json` жібергенде браузер алдымен OPTIONS сұранысын жібереді. Like батырмасы header-сіз POST жібереді — preflight жоқ.

**Server vs Client requests** — `/courses` беті Next.js сервері арқылы деректер алады (CORS керек емес). Filter, Like, Форма — браузердің өзі жібереді (CORS міндетті).

---

## 📝 Шешімдер туралы

**generateStaticParams неге жойылды?**
`generateStaticParams` build кезінде `getCourses()` шақырады. Backend өшіп тұрса build сәтсіз аяқталады. Курс деректері backend-те тұрады және кез келген уақытта өзгеруі мүмкін — алдын ала build жасаудың мәні жоқ.

**Like неге preflight-сіз, форма неге preflight-пен?**
Like — body жоқ, арнайы header жоқ → "simple request" → preflight жоқ.
Форма — `Content-Type: application/json` header-і бар → "non-simple request" → браузер алдымен OPTIONS жібереді.

---

## 🔴 Breakage журналы

### Breakage 1: CORS мүлдем өшірілді
- **Не істедім:** `app.add_middleware(...)` блогін түгел comment-тедім
- **Console:** `No 'Access-Control-Allow-Origin' header is present on the requested resource`
- **Network:** courses — қызыл (CORS error), backend логінде 200 OK
- **Себебі:** CORS middleware жоқ — сервер орындады бірақ браузерге рұқсат бермеді
- **Қалай таптым:** 3-қадам — response headers-та `access-control-allow-origin` жоқ

### Breakage 2: allow_origins-та trailing slash
- **Не істедім:** `"http://localhost:3000"` → `"http://localhost:3000/"`
- **Console:** сол хабарлама
- **Network:** форма OPTIONS → 400, POST жіберілмеді
- **Себебі:** `"http://localhost:3000/"` ешқандай origin-мен сәйкес келмейді
- **Қалай таптым:** 3-қадам — header бар бірақ мән сәйкес емес

### Breakage 3: allow_methods жойылды
- **Не істедім:** `allow_methods=["*"]` жолын өшірдім
- **Console:** `It does not have HTTP ok status`
- **Network:** /filter OK, Like OK, Форма OPTIONS → 400
- **Себебі:** тек GET рұқсатты, POST жоқ
- **Қалай таптым:** 2-қадам — OPTIONS 400, curl-мен тексердім: `Disallowed CORS method`

### Breakage 4: Басқа origin (127.0.0.1)
- **Не істедім:** `http://127.0.0.1:3000/filter` деп аштым
- **Console:** `from origin 'http://127.0.0.1:3000' has been blocked`
- **Network:** courses қызыл, backend 200 OK
- **Себебі:** `localhost` ≠ `127.0.0.1` — браузерге екі түрлі origin
- **Қалай таптым:** 3-қадам — Origin header `127.0.0.1:3000`, allow_origins-та жоқ

### Breakage 5: Python қатесі CORS сияқты көрінді
- **Не істедім:** `p["offset"]` → `p["ofset"]` деп теріп жіберді
- **Console:** `No 'Access-Control-Allow-Origin' header` — CORS сияқты!
- **Network:** courses қызыл. Backend логінде: `500 Internal Server Error`, `KeyError: 'ofset'`
- **Себебі:** 500 жауабы CORSMiddleware-дің сыртынан шығады — header-лер жоқ
- **Қалай таптым:** 5-қадам — backend терминалында traceback көрдім

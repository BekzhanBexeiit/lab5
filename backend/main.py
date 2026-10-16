from typing import Literal

from fastapi import Depends, FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware

from data import find_course, get_all_courses
from models import Course, Enrollment, EnrollmentIn

# FastAPI қосымшасын жасаймыз — бұл бүкіл API-дің негізі
app = FastAPI(title="Course Catalog API")

# -----------------------------------------------------------------------
# CORS — браузерге басқа адрестен сұраныс жіберуге рұқсат береміз
# Next.js frontend http://localhost:3000-де жұмыс істейді,
# ал backend http://localhost:8000-де — бұл екі түрлі "origin".
# Браузер origin басқа болса жауапты жасырады, осыны болдырмау үшін
# CORSMiddleware қосылады.
# -----------------------------------------------------------------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # тек осы адреске рұқсат
    allow_methods=["*"],                      # барлық HTTP әдістері: GET, POST, т.б.
    allow_headers=["*"],                      # барлық header-лер: Content-Type, т.б.
)

# Тіркелулер серверде жадта сақталады (деректер базасы жоқ әзірше)
ENROLLMENTS: list[Enrollment] = []


# Pagination dependency — бет нөмірі мен бет өлшемінен offset/limit есептейді
def pagination(
    page: int = Query(default=1, ge=1),
    page_size: int = Query(default=20, ge=1, le=100),
) -> dict:
    return {"offset": (page - 1) * page_size, "limit": page_size}


# -----------------------------------------------------------------------
# Роутлар (маршруттар) — URL-ге сәйкес қайсы функция жұмыс істейтінін анықтайды
# -----------------------------------------------------------------------

# GET / — сервердің жұмыс істеп тұрғанын тексеру
@app.get("/")
def read_root():
    return {"message": "Course Catalog API is running"}


# GET /courses — барлық курстарды қайтарады
# Сүзгі: is_elective, іздеу: q, сорттау: sort, беттеу: page/page_size
@app.get("/courses", response_model=list[Course])
def list_courses(
    is_elective: bool | None = None,
    sort: Literal["popular", "title"] = "popular",
    q: str | None = None,
    p: dict = Depends(pagination),
):
    courses = get_all_courses()

    # Elective/required бойынша сүзгі
    if is_elective is not None:
        courses = [c for c in courses if c.is_elective == is_elective]

    # Атауы бойынша іздеу (регистрге сезімтал емес)
    if q is not None:
        courses = [c for c in courses if q.lower() in c.title.lower()]

    # Сорттау: likes бойынша (popular) немесе атауы бойынша (title)
    if sort == "title":
        courses = sorted(courses, key=lambda c: c.title)
    else:
        courses = sorted(courses, key=lambda c: c.likes, reverse=True)

    # Беттеу: тек қажетті бөлігін қайтарамыз
    courses = courses[p["offset"] : p["offset"] + p["limit"]]

    return courses


# GET /courses/{course_id} — бір курсты ID бойынша қайтарады
# Табылмаса 404 қатесін береді
@app.get("/courses/{course_id}", response_model=Course)
def get_course(course_id: str):
    course = find_course(course_id)
    if course is None:
        raise HTTPException(status_code=404, detail="Course not found")
    return course


# POST /courses/{course_id}/like — курсқа like қосады
# Like санын 1-ге арттырып, жаңартылған курсты қайтарады
@app.post("/courses/{course_id}/like", response_model=Course)
def like_course(course_id: str):
    course = find_course(course_id)
    if course is None:
        raise HTTPException(status_code=404, detail="Course not found")
    course.likes += 1
    return course


# POST /enrollments — курсқа тіркелу
# Клиент JSON жібереді: {"courseId": "...", "studentName": "..."}
# Курс табылмаса 404, атау 2 символдан қысқа болса 422 қатесі
# Сәтті болса 201 статусымен жаңа тіркелу жазбасын қайтарады
@app.post("/enrollments", response_model=Enrollment, status_code=201)
def create_enrollment(data: EnrollmentIn):
    course = find_course(data.course_id)
    if course is None:
        raise HTTPException(status_code=404, detail="Course not found")
    enrollment = Enrollment(
        id=len(ENROLLMENTS) + 1,
        course_id=data.course_id,
        student_name=data.student_name,
    )
    ENROLLMENTS.append(enrollment)
    return enrollment


# GET /enrollments — барлық тіркелулер тізімін қайтарады
@app.get("/enrollments", response_model=list[Enrollment])
def list_enrollments():
    return ENROLLMENTS

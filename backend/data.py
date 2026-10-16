from models import Course

# Серверде жадта сақталатын 6 курс (деректер базасы жоқ әзірше)
# Сервер қайта іске қосылғанда likes саны бастапқы мәніне оралады
COURSES: list[Course] = [
    Course(
        id="modern-frontend",
        title="Modern Frontend: React & Next.js",
        description="React 19, Server Components, and the App Router.",
        credits=5,
        likes=24,
    ),
    Course(
        id="backend-fastapi",
        title="Backend Foundations: FastAPI",
        description="Async REST APIs in Python with FastAPI and Pydantic.",
        credits=5,
        likes=19,
    ),
    Course(
        id="databases-postgresql",
        title="Relational Databases: PostgreSQL",
        description="Schemas, SQLAlchemy, and migrations with Alembic.",
        credits=5,
        likes=15,
    ),
    Course(
        id="api-design",
        title="API Design: REST vs GraphQL",
        description="Comparing REST and GraphQL in one hands-on project.",
        credits=4,
        is_elective=True,  # таңдау пәні
        likes=11,
    ),
    Course(
        id="web-security",
        title="Web Security Essentials",
        description="JWT/OAuth2, XSS, CSRF, and SQL injection defense.",
        credits=4,
        likes=21,
    ),
    Course(
        id="ai-integration",
        title="AI/LLM Integration",
        description="LLM features in an app via the OpenAI API.",
        credits=5,
        is_elective=True,  # таңдау пәні
        likes=32,          # ең көп liked курс → бірінші орын
    ),
]


# Барлық курстарды тізім ретінде қайтарады
def get_all_courses() -> list[Course]:
    return list(COURSES)


# ID бойынша бір курс іздейді, табылмаса None қайтарады
def find_course(course_id: str) -> Course | None:
    for course in COURSES:
        if course.id == course_id:
            return course
    return None

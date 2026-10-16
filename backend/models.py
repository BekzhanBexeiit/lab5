from pydantic import BaseModel, ConfigDict, Field
from pydantic.alias_generators import to_camel


# CamelModel — барлық модельдерге ортақ негіз
# JSON-да атаулар автоматты түрде camelCase-ке ауысады:
# is_elective → isElective, course_id → courseId, student_name → studentName
# Бұл frontend TypeScript типтерімен сәйкес келу үшін қажет
class CamelModel(BaseModel):
    model_config = ConfigDict(
        alias_generator=to_camel,   # Python snake_case → JSON camelCase
        validate_by_name=True,      # data.py is_elective=True деп жаза береді
        validate_by_alias=True,     # клиент isElective деп жібере алады
    )


# Course — бір курстың деректері
# JSON-да: id, title, description, credits, isElective, likes
class Course(CamelModel):
    id: str
    title: str
    description: str
    credits: int
    is_elective: bool = False
    likes: int = 0


# EnrollmentIn — клиент жіберетін тіркелу деректері
# JSON-да: courseId, studentName (2 символдан кем болмауы тиіс)
class EnrollmentIn(CamelModel):
    course_id: str
    student_name: str = Field(min_length=2)


# Enrollment — сервер сақтайтын тіркелу жазбасы (id қосылады)
# JSON-да: id, courseId, studentName
class Enrollment(EnrollmentIn):
    id: int

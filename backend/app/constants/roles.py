from enum import Enum

class Role(str, Enum):
    STUDENT = "student"
    STAFF = "staff"
    ADMIN = "admin"

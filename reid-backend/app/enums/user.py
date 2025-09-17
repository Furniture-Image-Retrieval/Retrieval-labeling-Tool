from app.enums.enum_base import BaseEnum


class USER_ROLE(str, BaseEnum):
    ANNOTATOR = "annotator"
    REVIEWER = "reviewer"
    ADMIN = "admin"

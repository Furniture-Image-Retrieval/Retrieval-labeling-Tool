from app.enums.enum_base import BaseEnum


class PROJECT_STATUS(str, BaseEnum):
    TODO = "to do"
    IN_ANNOTATION = "in annotation"
    REQ_TO_REVIEW = "request to review"
    IN_REVIEW = "in review"
    DONE = "done"
    ARCHIVE = "archive"

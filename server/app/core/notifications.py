from sqlmodel import Session

from app.database import engine
from app.models import ActivityLog, Notification


def record_activity(session: Session, user_id: int | None, action: str, details: str | None = None) -> ActivityLog:
    activity = ActivityLog(user_id=user_id, action=action, details=details)
    session.add(activity)
    session.commit()
    session.refresh(activity)
    return activity


def queue_notification(session: Session, user_id: int, message: str, notification_type: str = "info") -> Notification:
    notification = Notification(
        user_id=user_id,
        message=message,
        type=notification_type,
    )
    session.add(notification)
    session.commit()
    session.refresh(notification)
    return notification


def record_operational_event(user_id: int | None, action: str, details: str | None = None, message: str | None = None, notification_type: str = "info") -> None:
    with Session(engine) as session:
        try:
            record_activity(session, user_id, action, details)
            if user_id is not None and message:
                queue_notification(session, user_id, message, notification_type)
        except Exception:
            session.rollback()
            raise

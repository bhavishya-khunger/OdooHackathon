from jose import JWTError
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.requests import Request
from starlette.responses import JSONResponse

from app.config import settings
from app.core.notifications import record_operational_event
from app.core.security import decode_access_token


class AuthMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        if request.method == "OPTIONS":
            return await call_next(request)
            
        path = request.url.path

        if path in settings.PUBLIC_PATHS or path.startswith(settings.PUBLIC_PREFIXES):
            return await call_next(request)

        token = request.cookies.get(settings.COOKIE_NAME)
        if not token:
            return JSONResponse(
                status_code=401,
                content={"detail": "Not authenticated"},
            )

        try:
            payload = decode_access_token(token)
            user_id = payload.get("sub")
            role = payload.get("role")
            if user_id is None or role is None:
                raise JWTError("Missing token claims")

            request.state.user_id = int(user_id)
            request.state.role = role
        except (JWTError, ValueError, TypeError):
            return JSONResponse(
                status_code=401,
                content={"detail": "Invalid or expired session"},
            )

        return await call_next(request)


class ActivityLoggingMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        try:
            response = await call_next(request)
        except Exception as exc:
            user_id = getattr(request.state, "user_id", None)
            record_operational_event(
                user_id=user_id,
                action=f"{request.method} {request.url.path}",
                details=f"Failed: {exc}",
            )
            raise

        user_id = getattr(request.state, "user_id", None)
        action = f"{request.method} {request.url.path}"
        detail = f"Status {response.status_code}"
        message = f"{request.method} {request.url.path} completed with status {response.status_code}"

        record_operational_event(
            user_id=user_id,
            action=action,
            details=detail,
            message=message if user_id is not None else None,
        )
        return response

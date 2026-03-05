from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
# from app.routes import auth_routes, ticket_routes, admin_routes, staff_routes

app = FastAPI(title="Digital Complaint System API")

# Configure CORS
origins = [
    "http://localhost:5173",    # Local development
    "http://127.0.0.1:5173",  # Local development (alternate)
    "https://dcmts.vercel.app", # Production frontend
    "https://dcmts.onrender.com" # Production backend
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# TODO: Include routes once they are implemented
from app.routes import auth_routes, ticket_routes, admin_routes, staff_routes
app.include_router(auth_routes.router, prefix="/auth", tags=["auth"])
app.include_router(ticket_routes.router, prefix="/tickets", tags=["tickets"])
app.include_router(admin_routes.router, prefix="/admin", tags=["admin"])
app.include_router(staff_routes.router, prefix="/staff", tags=["staff"])

@app.get("/")
def read_root():
    return {"message": "Welcome to the Digital Complaint System API"}

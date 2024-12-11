from fastapi import FastAPI
from router import userRouter, paymentRouter,courseRouter,userCourseRouter
from fastapi.middleware.cors import CORSMiddleware





app = FastAPI()
app.include_router(userRouter.router, prefix="/user", tags=["User"])
app.include_router(courseRouter.router, prefix="/course", tags=["Course"])
app.include_router(paymentRouter.router, prefix="/payment", tags=["Payment"])
app.include_router(userCourseRouter.router, prefix="/userCourse", tags=["UserCourse"])


app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Frontend origin
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

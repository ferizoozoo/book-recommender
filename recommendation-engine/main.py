from typing import Union

from fastapi import FastAPI

from recommendation import get_recommendations

app = FastAPI()

@app.get("/recommendations/{phrase}")
def get_user_recommendations(phrase: str):
    recommendations = get_recommendations(phrase)
    return {"recommendations": recommendations}
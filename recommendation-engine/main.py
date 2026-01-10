from typing import Union

from fastapi import FastAPI
from fastapi import Response

from recommendation import get_recommendations

app = FastAPI()

@app.get("/recommendations/{phrase}")
def get_user_recommendations(phrase: str, response: Response):
    recommendations = get_recommendations(phrase)
    response.headers["Access-Control-Allow-Origin"] = "*"
    response.headers["Access-Control-Allow-Methods"] = "GET, POST, OPTIONS"
    response.headers["Access-Control-Allow-Headers"] = "Content-Type"
    return {"recommendations": recommendations}
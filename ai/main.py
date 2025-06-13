from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import os
from openai import OpenAI

# Initialize FastAPI app
app = FastAPI()

# Enable CORS to allow requests from your frontend (e.g., localhost:3000)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # You can replace "*" with ["http://localhost:3000"] in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize OpenAI client
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

# Request model
class ProblemRequest(BaseModel):
    problem: str
    theme: str

# Endpoint to rewrite math problem
@app.post("/api/rewrite-problem")
async def rewrite_problem(request: ProblemRequest):
    try:
        prompt = f"Rewrite the following math problem using the theme '{request.theme}': {request.problem}"

        response = client.chat.completions.create(
            model="gpt-4o",
            messages=[
                {"role": "system", "content": "You are a math teacher helping students understand problems better."},
                {"role": "user", "content": prompt}
            ]
        )

        rewritten_problem = response.choices[0].message.content
        return {"rewritten_problem": rewritten_problem}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

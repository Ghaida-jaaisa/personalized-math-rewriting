from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import os
from openai import OpenAI  
app = FastAPI()

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))  

class ProblemRequest(BaseModel):
    problem: str
    theme: str

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

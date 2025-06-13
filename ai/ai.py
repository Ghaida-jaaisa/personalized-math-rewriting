from openai import OpenAI
import os
from dotenv import load_dotenv

load_dotenv()

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY")) 

def rewrite_math_problem(problem: str, theme: str) -> str:
    prompt = f"""
You are an AI that rewrites math word problems for students based on their personal interests.
Rephrase the following math problem using the theme "{theme}". Keep the mathematical structure and difficulty the same.

Original Problem:
"{problem}"

Rewritten Problem:"""

    response = client.chat.completions.create(  
        model="gpt-4",
        messages=[{"role": "user", "content": prompt}],
        temperature=0.7
    )
    return response.choices[0].message.content.strip()

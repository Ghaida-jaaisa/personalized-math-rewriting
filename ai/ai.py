from openai import OpenAI
import os
from dotenv import load_dotenv

load_dotenv()

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY")) 

def rewrite_math_problem(problem: str, theme: str) -> str:
    prompt = f"""
You are an AI that rewrites math word problems using a student's personal interest.

Rephrase the following math problem using the theme "{theme}" in a **simple and direct** way. 
Do not add any storytelling, titles, introductions, or extra descriptions. Keep the structure and difficulty the same.
Do not include any extra words or formatting. Only return the rewritten problem sentence.

Original:
{problem}

Rewritten:
"""
    response = client.chat.completions.create(  
        model="gpt-4",
        messages=[{"role": "user", "content": prompt}],
        temperature=0.7
    )
    return response.choices[0].message.content.strip()

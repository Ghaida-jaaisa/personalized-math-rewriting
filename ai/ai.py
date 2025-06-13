from openai import OpenAI
import os
from dotenv import load_dotenv

load_dotenv()

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

def rewrite_math_problem(problem: str, theme: str) -> str:
    system_message = (
        "You are a helpful assistant that rewrites math word problems by changing only the context "
        "to match a student's interest. Do not add introductions, phrases like 'Sure!', 'Let's reframe...', "
        "'Imagine', or any additional context. Do not add formatting (like bold or markdown). "
        "Return only the rewritten problem sentence. Keep the difficulty and structure the same."
    )

    user_prompt = (
        f"Rewrite this math problem using the theme '{theme}'. "
        f"Only return the final rewritten sentence, and nothing else.\n\n"
        f"Original: {problem}\nRewritten:"
    )

    response = client.chat.completions.create(
        model="gpt-4",
        messages=[
            {"role": "system", "content": system_message},
            {"role": "user", "content": user_prompt}
        ],
        temperature=0.7
    )

    return response.choices[0].message.content.strip()

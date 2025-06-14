from openai import OpenAI
import os
from dotenv import load_dotenv

load_dotenv()

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

def rewrite_math_problem(problem: str, theme: str) -> str:
    system_message = (
        "You are a helpful assistant that rewrites math word problems by changing only the context "
        "to match a student's interest. You must strictly follow these rules:\n"
        "- Do NOT start with 'Sure!', 'Let's', 'Imagine', or any similar introduction.\n"
        "- Do NOT add any preamble, explanation, commentary, or formatting (no bold, markdown, or newlines).\n"
        "- Only return the rewritten math problem sentence, nothing more.\n"
        "- Preserve the original structure and difficulty of the problem."
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


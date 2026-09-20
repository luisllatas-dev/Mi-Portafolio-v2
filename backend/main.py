"""
Backend FastAPI del asistente Nani (portafolio de Luis).
Auth: DefaultAzureCredential → Managed Identity en Azure / az login en local.
"""
import os
import re
from typing import List, Literal, Optional

import httpx
from azure.identity.aio import DefaultAzureCredential
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

ENDPOINT = os.getenv(
    "FOUNDRY_PROJECT_ENDPOINT",
    "https://ch73014115-5657-resource.services.ai.azure.com/api/projects/ch73014115-5657",
).rstrip("/")
AGENT_NAME = os.getenv("FOUNDRY_AGENT_NAME", "Nani")
AGENT_VERSION = os.getenv("FOUNDRY_AGENT_VERSION", "1")
SCOPE = "https://ai.azure.com/.default"
MAX_QUESTIONS = int(os.getenv("CHAT_MAX_QUESTIONS", "5"))

# Orígenes permitidos (CORS)
ALLOWED_ORIGINS = [
    o.strip()
    for o in os.getenv(
        "ALLOWED_ORIGINS",
        "https://luiseduardoportafolio.vercel.app,http://localhost:5173,http://127.0.0.1:5173",
    ).split(",")
    if o.strip()
]

app = FastAPI(title="Nani API", version="1.0.0")
app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS or ["*"],
    allow_credentials=False,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["Content-Type"],
)

_credential = None


def get_credential():
    global _credential
    if _credential is None:
        _credential = DefaultAzureCredential()
    return _credential


class ChatMessage(BaseModel):
    role: Literal["user", "assistant"]
    content: str = Field(min_length=1, max_length=2000)


class ChatRequest(BaseModel):
    messages: List[ChatMessage]
    asked: Optional[int] = 0


def extract_reply(payload: dict) -> Optional[str]:
    if not payload:
        return None
    out_text = payload.get("output_text")
    if isinstance(out_text, str) and out_text.strip():
        return clean_citations(out_text)

    parts: List[str] = []

    def walk(node):
        if node is None or not isinstance(node, (dict, list)):
            return
        if isinstance(node, list):
            for item in node:
                walk(item)
            return
        text = node.get("text")
        ntype = node.get("type")
        if isinstance(text, str) and text.strip() and ntype in (None, "output_text", "text"):
            parts.append(text.strip())
            return
        if isinstance(node.get("content"), list):
            walk(node["content"])
        if isinstance(node.get("output"), list):
            walk(node["output"])

    walk(payload.get("output") or payload)
    joined = "\n".join(parts).strip()
    return clean_citations(joined) if joined else None


def clean_citations(text: str) -> str:
    # Marca RAG de Foundry: …filecite…turn0fileN…L12-L20…
    text = re.sub(r"\s*\S*filecite\S*.*$", "", text, flags=re.DOTALL)
    # Citas tipo [1†source]
    text = re.sub(r"\[\d+[†\u2020][^\]]*\]", "", text)
    return text.strip()


@app.get("/health")
async def health():
    return {"ok": True, "agent": AGENT_NAME, "version": AGENT_VERSION}


@app.post("/chat")
async def chat(req: ChatRequest):
    asked = int(req.asked or 0)
    if asked >= MAX_QUESTIONS:
        raise HTTPException(
            status_code=429,
            detail={
                "error": "Has alcanzado el límite de preguntas de esta sesión.",
                "limitReached": True,
                "maxQuestions": MAX_QUESTIONS,
            },
        )

    input_msgs = [
        {"role": m.role, "content": m.content.strip()[:2000]}
        for m in req.messages
        if m.role in ("user", "assistant") and m.content.strip()
    ]
    if not input_msgs:
        raise HTTPException(status_code=400, detail={"error": "Mensaje vacío"})

    token = await get_credential().get_token(SCOPE)
    url = f"{ENDPOINT}/openai/v1/responses"
    body = {
        "input": input_msgs,
        "agent_reference": {
            "name": AGENT_NAME,
            "version": AGENT_VERSION,
            "type": "agent_reference",
        },
    }

    async with httpx.AsyncClient(timeout=55.0) as client:
        res = await client.post(
            url,
            json=body,
            headers={
                "Authorization": f"Bearer {token.token}",
                "Content-Type": "application/json",
            },
        )

    if res.status_code == 400:
        # Formato alternativo del SDK JS
        body_js = {
            "input": input_msgs,
            "agent": {
                "name": AGENT_NAME,
                "version": AGENT_VERSION,
                "type": "agent_reference",
            },
        }
        async with httpx.AsyncClient(timeout=55.0) as client:
            res = await client.post(
                url,
                json=body_js,
                headers={
                    "Authorization": f"Bearer {token.token}",
                    "Content-Type": "application/json",
                },
            )

    if res.status_code >= 400:
        raise HTTPException(
            status_code=502,
            detail={"error": "El asistente no pudo responder en este momento."},
        )

    payload = res.json()
    reply = extract_reply(payload) or "No pude generar una respuesta."
    next_asked = asked + 1
    return {
        "reply": reply,
        "asked": next_asked,
        "maxQuestions": MAX_QUESTIONS,
        "limitReached": next_asked >= MAX_QUESTIONS,
    }


@app.on_event("shutdown")
async def _shutdown():
    global _credential
    if _credential is not None:
        await _credential.close()
        _credential = None


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=int(os.getenv("PORT", "8000")))

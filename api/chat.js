import { ClientSecretCredential, DefaultAzureCredential } from "@azure/identity";

const ENDPOINT = process.env.FOUNDRY_PROJECT_ENDPOINT;
const AGENT_NAME = process.env.FOUNDRY_AGENT_NAME || "Nani";
const AGENT_VERSION = process.env.FOUNDRY_AGENT_VERSION || "1";
const TENANT_ID = process.env.AZURE_TENANT_ID;
const CLIENT_ID = process.env.AZURE_CLIENT_ID;
const CLIENT_SECRET = process.env.AZURE_CLIENT_SECRET;

const hasServicePrincipal = Boolean(TENANT_ID && CLIENT_ID && CLIENT_SECRET);

const ALLOWED_ORIGIN = process.env.SITE_ORIGIN || "*";
const MAX_QUESTIONS = Number(process.env.CHAT_MAX_QUESTIONS || 5);

export const config = { maxDuration: 60 };

function getCredential() {
  if (hasServicePrincipal) {
    return new ClientSecretCredential(TENANT_ID, CLIENT_ID, CLIENT_SECRET);
  }
  // Local/dev: requiere `az login` (no funciona en Vercel)
  return new DefaultAzureCredential();
}

function extractReply(json) {
  if (!json) return null;
  if (typeof json.output_text === "string" && json.output_text.trim()) {
    return json.output_text.trim();
  }
  const parts = [];
  const walk = (node) => {
    if (!node || typeof node !== "object") return;
    if (
      typeof node.text === "string" &&
      node.text.trim() &&
      (node.type === "output_text" || node.type === "text" || !node.type)
    ) {
      parts.push(node.text.trim());
      return;
    }
    if (Array.isArray(node)) {
      node.forEach(walk);
      return;
    }
    if (Array.isArray(node.content)) node.content.forEach(walk);
    if (Array.isArray(node.output)) node.output.forEach(walk);
  };
  walk(json.output || json);
  const joined = parts.join("\n").trim();
  return (
    joined
      .replace(/\s*\S*filecite\S*.*$/su, "")
      .replace(/\[\d+[†\u2020][^\]]*\]/g, "")
      .trim() || null
  );
}

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", ALLOWED_ORIGIN);
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(204).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Método no permitido" });

  if (!ENDPOINT) {
    return res.status(503).json({
      error: "Falta FOUNDRY_PROJECT_ENDPOINT. Configura el endpoint de Foundry.",
    });
  }

  let body = req.body;
  if (typeof body === "string") {
    try {
      body = JSON.parse(body);
    } catch {
      return res.status(400).json({ error: "JSON inválido" });
    }
  }

  const messages = body?.messages;
  if (!Array.isArray(messages) || messages.length === 0) {
    return res.status(400).json({ error: "Falta el historial de mensajes" });
  }

  const lastUser = [...messages].reverse().find((m) => m.role === "user");
  const question = typeof lastUser?.content === "string" ? lastUser.content.trim() : "";
  if (!question) return res.status(400).json({ error: "Mensaje vacío" });
  if (question.length > 1000) return res.status(400).json({ error: "Mensaje demasiado largo" });

  const asked = Number(body?.asked ?? 0);
  if (asked >= MAX_QUESTIONS) {
    return res.status(429).json({
      error: "Has alcanzado el límite de preguntas de esta sesión.",
      limitReached: true,
      maxQuestions: MAX_QUESTIONS,
    });
  }

  try {
    const credential = getCredential();
    const token = await credential.getToken("https://ai.azure.com/.default");
    if (!token?.token) throw new Error("No se pudo obtener token de Azure");

    const input = messages
      .filter((m) => m.role === "user" || m.role === "assistant")
      .map((m) => ({ role: m.role, content: String(m.content).slice(0, 2000) }));

    const url = `${ENDPOINT.replace(/\/$/, "")}/openai/v1/responses`;

    const makeBody = (shape) =>
      shape === "python"
        ? {
            input,
            agent_reference: {
              name: AGENT_NAME,
              version: AGENT_VERSION,
              type: "agent_reference",
            },
          }
        : {
            input,
            agent: { name: AGENT_NAME, type: "agent_reference", version: AGENT_VERSION },
          };

    const callFoundry = async (shape) => {
      const r = await fetch(url, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token.token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(makeBody(shape)),
      });
      const text = await r.text();
      let json = null;
      try {
        json = JSON.parse(text);
      } catch {
        /* body no JSON */
      }
      return { ok: r.ok, status: r.status, json, text };
    };

    let result = await callFoundry("python");
    if (!result.ok && result.status === 400) {
      result = await callFoundry("js");
    }

    if (!result.ok) {
      console.error("Foundry error", result.status, result.text?.slice(0, 500));
      return res.status(502).json({
        error: "El asistente no pudo responder en este momento.",
      });
    }

    const reply = extractReply(result.json) || "No pude generar una respuesta.";

    return res.status(200).json({
      reply,
      asked: asked + 1,
      maxQuestions: MAX_QUESTIONS,
      limitReached: asked + 1 >= MAX_QUESTIONS,
    });
  } catch (err) {
    console.error("Chat API error:", err?.message || err);
    return res.status(500).json({ error: "Error interno del asistente." });
  }
}

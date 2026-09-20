/**
 * API local del chat (solo desarrollo).
 * Uso:
 *   az login
 *   node scripts/local-api.mjs
 *   npm run dev   → http://localhost:5173
 */
import http from "node:http";
import { ClientSecretCredential, DefaultAzureCredential } from "@azure/identity";

const ENDPOINT =
  process.env.FOUNDRY_PROJECT_ENDPOINT ||
  "https://ch73014115-5657-resource.services.ai.azure.com/api/projects/ch73014115-5657";
const AGENT_NAME = process.env.FOUNDRY_AGENT_NAME || "Nani";
const AGENT_VERSION = process.env.FOUNDRY_AGENT_VERSION || "1";
const PORT = Number(process.env.LOCAL_API_PORT || 8787);
const MAX_QUESTIONS = Number(process.env.CHAT_MAX_QUESTIONS || 5);

const credential =
  process.env.AZURE_TENANT_ID && process.env.AZURE_CLIENT_ID && process.env.AZURE_CLIENT_SECRET
    ? new ClientSecretCredential(
        process.env.AZURE_TENANT_ID,
        process.env.AZURE_CLIENT_ID,
        process.env.AZURE_CLIENT_SECRET
      )
    : new DefaultAzureCredential();

function extractReply(json) {
  if (!json) return null;
  if (typeof json.output_text === "string" && json.output_text.trim()) return json.output_text.trim();
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
  // Quitar marcas de cita RAG de Foundry (filecite / turn0file…)
  return joined.replace(/\s*\u{e000}?\s*filecite[\s\S]*$/u, "").replace(/\[\d+†[^\]]*\]/g, "").trim() || null;
}

async function handleChat(body) {
  const messages = body?.messages;
  if (!Array.isArray(messages) || messages.length === 0) {
    return { status: 400, data: { error: "Falta el historial de mensajes" } };
  }

  const asked = Number(body?.asked ?? 0);
  if (asked >= MAX_QUESTIONS) {
    return {
      status: 429,
      data: {
        error: "Has alcanzado el límite de preguntas de esta sesión.",
        limitReached: true,
        maxQuestions: MAX_QUESTIONS,
      },
    };
  }

  const input = messages
    .filter((m) => m.role === "user" || m.role === "assistant")
    .map((m) => ({ role: m.role, content: String(m.content).slice(0, 2000) }));

  const token = await credential.getToken("https://ai.azure.com/.default");
  const url = `${ENDPOINT.replace(/\/$/, "")}/openai/v1/responses`;
  const res = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token.token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      input,
      agent_reference: {
        name: AGENT_NAME,
        version: AGENT_VERSION,
        type: "agent_reference",
      },
    }),
  });

  const json = await res.json().catch(() => null);
  if (!res.ok) {
    console.error("Foundry", res.status, JSON.stringify(json).slice(0, 400));
    return { status: 502, data: { error: "El asistente no pudo responder." } };
  }

  return {
    status: 200,
    data: {
      reply: extractReply(json) || "No pude generar una respuesta.",
      asked: asked + 1,
      maxQuestions: MAX_QUESTIONS,
      limitReached: asked + 1 >= MAX_QUESTIONS,
    },
  };
}

const server = http.createServer(async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    res.writeHead(204).end();
    return;
  }

  if (req.method !== "POST" || !req.url?.startsWith("/api/chat")) {
    res.writeHead(404, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "Not found" }));
    return;
  }

  let raw = "";
  for await (const chunk of req) raw += chunk;

  try {
    const body = raw ? JSON.parse(raw) : {};
    const result = await handleChat(body);
    res.writeHead(result.status, { "Content-Type": "application/json; charset=utf-8" });
    res.end(JSON.stringify(result.data));
  } catch (err) {
    console.error(err);
    res.writeHead(500, { "Content-Type": "application/json; charset=utf-8" });
    res.end(JSON.stringify({ error: "Error interno" }));
  }
});

server.listen(PORT, () => {
  console.log(`Local chat API → http://localhost:${PORT}/api/chat`);
  console.log(`Agente: ${AGENT_NAME} v${AGENT_VERSION}`);
  console.log("Requiere az login (DefaultAzureCredential) si no hay Service Principal");
});

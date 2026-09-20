/**
 * Prueba local del agente Foundry (Nani) con `az login`.
 * Uso:
 *   az login
 *   node scripts/test-nani.mjs "¿Qué tecnologías maneja Luis?"
 */
import { DefaultAzureCredential, ClientSecretCredential } from "@azure/identity";

const ENDPOINT =
  process.env.FOUNDRY_PROJECT_ENDPOINT ||
  "https://ch73014115-5657-resource.services.ai.azure.com/api/projects/ch73014115-5657";
const AGENT_NAME = process.env.FOUNDRY_AGENT_NAME || "Nani";
const AGENT_VERSION = process.env.FOUNDRY_AGENT_VERSION || "1";

const question = process.argv[2] || "Tell me what you can help with.";

const credential =
  process.env.AZURE_TENANT_ID && process.env.AZURE_CLIENT_ID && process.env.AZURE_CLIENT_SECRET
    ? new ClientSecretCredential(
        process.env.AZURE_TENANT_ID,
        process.env.AZURE_CLIENT_ID,
        process.env.AZURE_CLIENT_SECRET
      )
    : new DefaultAzureCredential();

console.log("Endpoint:", ENDPOINT);
console.log("Agent:", AGENT_NAME, "v" + AGENT_VERSION);
console.log("Question:", question);
console.log("---");

try {
  const token = await credential.getToken("https://ai.azure.com/.default");
  if (!token?.token) throw new Error("Token vacío");
  console.log("Token OK (exp:", new Date(token.expiresOnTimestamp).toISOString(), ")");

  const url = `${ENDPOINT.replace(/\/$/, "")}/openai/v1/responses`;
  const body = {
    input: [{ role: "user", content: question }],
    agent_reference: {
      name: AGENT_NAME,
      version: AGENT_VERSION,
      type: "agent_reference",
    },
  };

  const res = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token.token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  const text = await res.text();
  console.log("HTTP", res.status);

  if (!res.ok) {
    // Reintenta con el formato del SDK JS (body.agent)
    const alt = {
      input: [{ role: "user", content: question }],
      agent: { name: AGENT_NAME, version: AGENT_VERSION, type: "agent_reference" },
    };
    const res2 = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token.token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(alt),
    });
    const text2 = await res2.text();
    console.log("Retry (js shape) HTTP", res2.status);
    if (!res2.ok) {
      console.error("FAIL python shape:", text.slice(0, 800));
      console.error("FAIL js shape:", text2.slice(0, 800));
      process.exit(1);
    }
    const j2 = JSON.parse(text2);
    console.log("Response:", j2.output_text || JSON.stringify(j2).slice(0, 500));
    process.exit(0);
  }

  const json = JSON.parse(text);
  console.log("Response:", json.output_text || JSON.stringify(json).slice(0, 800));
} catch (err) {
  console.error("ERROR:", err.message || err);
  process.exit(1);
}

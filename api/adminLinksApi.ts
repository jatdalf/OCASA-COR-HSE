import type { VercelRequest, VercelResponse } from "@vercel/node";

const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxO-rJpDmA6kxEQtrteTz8DfeKV14ExOd2Dsflqn9Gt6I8XH3RrlOkCdhdtwH9FtVqMLw/exec";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") return res.status(204).end();

  try {
    const adminToken = process.env.ADMIN_TOKEN || "";
    const authHeader = (req.headers.authorization || "").toString();
    const clientToken = authHeader.replace(/^Bearer\s+/i, "").trim();

    const body = req.method === "GET" ? req.query : req.body ?? {};
    const isWrite = body && body.resource === "links" && (body.action === "write" || body.action === "update");

    if (isWrite && clientToken !== adminToken) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const forwardBody: any = { ...(typeof body === "object" ? body : {}) };
    if (isWrite && adminToken) forwardBody.token = adminToken;

    const fetchRes = await fetch(SCRIPT_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(forwardBody),
    });

    const text = await fetchRes.text();
    let data;
    try { data = JSON.parse(text); } catch { data = { raw: text }; }

    return res.status(fetchRes.ok ? 200 : 500).json(data);
  } catch (err: any) {
    console.error("api/adminLinks error:", err);
    return res.status(500).json({ error: err?.message || "Internal error" });
  }
}
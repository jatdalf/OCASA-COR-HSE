import type { VercelRequest, VercelResponse } from "@vercel/node";

const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwdWOF90G1_fTwW3qTjvIct-0LBnvXhvyWkfTzQ-iAiFYJRcrCQYONM4KsAYyeVOPmgCA/exec";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const response = await fetch(SCRIPT_URL, {
      method: req.method,
      headers: { "Content-Type": "application/json" },
      body: req.method === "POST" ? JSON.stringify(req.body) : undefined,
    });

    const data = await response.json();
    res.setHeader("Access-Control-Allow-Origin", "*"); // ✅ evita bloqueos CORS
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    res.status(200).json(data);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
}

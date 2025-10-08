import type { VercelRequest, VercelResponse } from "@vercel/node";

const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwdWOF90G1_fTwW3qTjvIct-0LBnvXhvyWkfTzQ-iAiFYJRcrCQYONM4KsAYyeVOPmgCA/exec";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const response = await fetch(SCRIPT_URL, {
      method: req.method,
      headers: { "Content-Type": "application/json" },
      body: req.method === "POST" ? JSON.stringify(req.body) : undefined,
    });

    if (!response.ok) {
      throw new Error(`Error al obtener datos: ${response.statusText}`);
    }

    const contentType = response.headers.get("Content-Type");
    let data;

    if (contentType && contentType.includes("application/json")) {
      data = await response.json();
    } else {
      const text = await response.text();
      throw new Error(`Se esperaba JSON, pero se recibió: ${text}`);
    }

    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    res.status(200).json(data);
  } catch (err: any) {
    console.error("Error en la función proxiCounter:", err);
    res.status(500).json({ error: err.message });
  }
}

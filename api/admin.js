const crypto = require("crypto");
const { getJSON, setJSON } = require("./_redis");

const DURATION = 10 * 60 * 1000;

function okPassword(given) {
  const real = process.env.ADMIN_PASSWORD || "";
  if (!real || typeof given !== "string") return false;
  const a = crypto.createHash("sha256").update(given).digest();
  const b = crypto.createHash("sha256").update(real).digest();
  return crypto.timingSafeEqual(a, b);
}

module.exports = async (req, res) => {
  res.setHeader("Cache-Control", "no-store");
  if (req.method !== "POST") return res.status(405).json({ error: "method" });
  const body = typeof req.body === "string" ? JSON.parse(req.body || "{}") : req.body || {};
  if (!okPassword(body.password)) return res.status(401).json({ error: "unauthorized" });

  try {
    const state = await getJSON("hb:state", { status: "waiting" });
    if (body.action === "check") return res.status(200).json({ ok: true });

    if (body.action === "start") {
      if (state.status === "running") return res.status(409).json({ error: "already started" });
      await setJSON("hb:state", { status: "running", startedAt: Date.now(), duration: DURATION });
      return res.status(200).json({ ok: true });
    }
    if (body.action === "reset") {
      await setJSON("hb:state", { status: "waiting" });
      return res.status(200).json({ ok: true });
    }
    if (body.action === "prompts") {
      const p = body.prompts;
      if (!Array.isArray(p) || p.length !== 24 || !p.every((x) => typeof x === "string" && x.length <= 40))
        return res.status(400).json({ error: "bad prompts" });
      await setJSON("hb:prompts", p);
      return res.status(200).json({ ok: true });
    }
    return res.status(400).json({ error: "bad action" });
  } catch (e) {
    return res.status(500).json({ error: "server" });
  }
};

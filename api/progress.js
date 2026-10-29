// Participants report WHICH squares they filled (a number, no photos, no names).
const { cmd, pipe, getJSON } = require("./_redis");

const DURATION = 10 * 60 * 1000;
const GRACE = 60 * 1000;
const MAX_PLAYERS = 600;
const FULL = ((1 << 25) - 1) & ~(1 << 12); // all 24 boxes (centre is FREE)

module.exports = async (req, res) => {
  res.setHeader("Cache-Control", "no-store");
  if (req.method !== "POST") return res.status(405).json({ error: "method" });
  try {
    const b = typeof req.body === "string" ? JSON.parse(req.body || "{}") : req.body || {};
    const { pid, mask } = b;
    const name = String(b.name || "").replace(/[\u0000-\u001f<>]/g, "").replace(/\s+/g, " ").trim().slice(0, 24);
    if (name.length < 2) return res.status(400).json({ error: "name" });
    if (typeof pid !== "string" || !/^[a-z0-9]{8,24}$/.test(pid)) return res.status(400).json({ error: "pid" });
    if (!Number.isInteger(mask) || mask < 0 || mask >= 1 << 25) return res.status(400).json({ error: "mask" });

    const state = await getJSON("hb:state", { status: "waiting" });
    const now = Date.now();
    if (state.status !== "running" || now < state.startedAt || now > state.startedAt + (state.duration || DURATION) + GRACE)
      return res.status(403).json({ error: "round closed" });

    const [exists, count] = await pipe([["HEXISTS", "hb:prog", pid], ["HLEN", "hb:prog"]]);
    if (!exists && count >= MAX_PLAYERS) return res.status(429).json({ error: "full" });
    await cmd(["HSET", "hb:prog", pid, JSON.stringify({ m: mask, n: name })]);
    if (mask === FULL && (await cmd(["SADD", "hb:full", pid])) === 1)
      await cmd(["RPUSH", "hb:winners", JSON.stringify({ pid, t: Date.now() })]); // order = who finished first
    return res.status(200).json({ ok: true });
  } catch (e) {
    return res.status(500).json({ error: "server" });
  }
};

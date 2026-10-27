const URL_ = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
const TOKEN = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;

async function cmd(args) {
  if (!URL_ || !TOKEN) throw new Error("Redis env vars missing");
  const r = await fetch(URL_, {
    method: "POST",
    headers: { Authorization: "Bearer " + TOKEN, "Content-Type": "application/json" },
    body: JSON.stringify(args),
  });
  const j = await r.json();
  if (j.error) throw new Error(j.error);
  return j.result;
}

async function getJSON(key, fallback) {
  const v = await cmd(["GET", key]);
  return v ? JSON.parse(v) : fallback;
}
const setJSON = (key, val) => cmd(["SET", key, JSON.stringify(val)]);

module.exports = { getJSON, setJSON };

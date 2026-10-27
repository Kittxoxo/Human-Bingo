const { getJSON } = require("./_redis");

module.exports = async (req, res) => {
  res.setHeader("Cache-Control", "no-store");
  try {
    const state = await getJSON("hb:state", { status: "waiting" });
    const prompts = await getJSON("hb:prompts", null);
    res.status(200).json({
      status: state.status,
      startedAt: state.startedAt || null,
      prompts,
      now: Date.now(), // server clock: every phone syncs to this
    });
  } catch (e) {
    res.status(500).json({ error: "server" });
  }
};

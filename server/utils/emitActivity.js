import { io } from "../server.js";

export const emitActivity = (req, type, message) => {
  try {
    io.emit("activity", {
      type,
      message,
      time: new Date().toISOString(),
      actor: req.user?.name || "System",
    });
  } catch {}
};

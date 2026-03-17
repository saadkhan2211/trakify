// src/components/ActivityFeed.js
// ─────────────────────────────────────────────────────
// Real-time activity feed via Socket.io.
// Drop this anywhere — it floats as a slide-in panel.
//
// Backend requirement (server/socket.js):
//   io.emit("activity", { type, message, time })
//   Call this from each controller after every write op.
// ─────────────────────────────────────────────────────
import React, { useEffect, useRef, useState } from "react";
import {
  X,
  Activity,
  CalendarCheck,
  CheckCircle2,
  UserPlus,
  FolderPlus,
  Building2,
} from "lucide-react";
import { cn } from "../lib/utils";

// Dynamic import so app doesn't crash if socket.io-client isn't installed yet
let io;
try {
  io = require("socket.io-client").io;
} catch {
  io = null;
}

const ICON_MAP = {
  attendance: {
    icon: CalendarCheck,
    cls: "bg-emerald-500/15 text-emerald-400",
  },
  task: { icon: CheckCircle2, cls: "bg-violet-500/15 text-violet-400" },
  employee: { icon: UserPlus, cls: "bg-blue-500/15 text-blue-400" },
  project: { icon: FolderPlus, cls: "bg-amber-500/15 text-amber-400" },
  department: { icon: Building2, cls: "bg-zinc-700 text-zinc-400" },
  default: { icon: Activity, cls: "bg-zinc-700 text-zinc-400" },
};

const timeAgo = (iso) => {
  const diff = (Date.now() - new Date(iso)) / 1000;
  if (diff < 60) return `${Math.floor(diff)}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  return `${Math.floor(diff / 3600)}h ago`;
};

export const ActivityFeed = () => {
  const [open, setOpen] = useState(false);
  const [events, setEvents] = useState([]);
  const [unread, setUnread] = useState(0);
  const [connected, setConn] = useState(false);
  const socketRef = useRef(null);
  const listRef = useRef(null);

  useEffect(() => {
    if (!io) return;

    const socket = io(
      process.env.REACT_APP_SOCKET_URL || "http://localhost:4000",
      {
        transports: ["websocket"],
        reconnectionAttempts: 5,
      },
    );
    socketRef.current = socket;

    socket.on("connect", () => setConn(true));
    socket.on("disconnect", () => setConn(false));

    socket.on("activity", (event) => {
      setEvents((prev) =>
        [{ ...event, id: Date.now() + Math.random() }, ...prev].slice(0, 50),
      );
      setUnread((n) => n + 1);
    });

    return () => socket.disconnect();
  }, []);

  // scroll to top when new event arrives
  useEffect(() => {
    if (open && listRef.current) listRef.current.scrollTop = 0;
  }, [events, open]);

  const handleOpen = () => {
    setOpen(true);
    setUnread(0);
  };

  return (
    <>
      {/* Floating trigger */}
      <button
        onClick={handleOpen}
        className={cn(
          "fixed bottom-6 right-6 z-50 flex h-12 w-12 items-center justify-center",
          "rounded-full border border-zinc-700 bg-zinc-900 shadow-lg",
          "hover:border-zinc-500 hover:bg-zinc-800 transition-all duration-200",
        )}
      >
        <Activity size={18} className="text-zinc-400" />
        {unread > 0 && (
          <span
            className="absolute -top-1 -right-1 flex h-5 w-5 items-center
            justify-center rounded-full bg-accent text-[9px] font-bold text-white"
          >
            {unread > 9 ? "9+" : unread}
          </span>
        )}
      </button>

      {/* Backdrop */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Panel */}
      <div
        className={cn(
          "fixed right-0 top-0 bottom-0 z-50 flex w-80 flex-col",
          "border-l border-zinc-800 bg-zinc-950 shadow-2xl",
          "transition-transform duration-300 ease-out",
          open ? "translate-x-0" : "translate-x-full",
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-800 px-5 py-4">
          <div className="flex items-center gap-2">
            <Activity size={15} className="text-zinc-400" />
            <span className="text-sm font-medium text-zinc-200">
              Activity Feed
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span
              className={cn(
                "flex items-center gap-1.5 text-[10px]",
                connected ? "text-emerald-400" : "text-zinc-600",
              )}
            >
              <span
                className={cn(
                  "h-1.5 w-1.5 rounded-full",
                  connected ? "bg-emerald-400 animate-pulse" : "bg-zinc-600",
                )}
              />
              {connected ? "Live" : "Offline"}
            </span>
            <button
              onClick={() => setOpen(false)}
              className="text-zinc-600 hover:text-zinc-300 transition-colors"
            >
              <X size={15} />
            </button>
          </div>
        </div>

        {/* Events list */}
        <div ref={listRef} className="flex-1 overflow-y-auto">
          {events.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-3 text-center px-6">
              <div className="p-3 rounded-xl bg-zinc-900">
                <Activity size={20} className="text-zinc-700" />
              </div>
              <p className="text-sm text-zinc-600">
                {connected
                  ? "Waiting for activity…"
                  : "Connect to a backend to see live events."}
              </p>
            </div>
          ) : (
            <div className="divide-y divide-zinc-800/50">
              {events.map((ev) => {
                const { icon: Icon, cls } =
                  ICON_MAP[ev.type] || ICON_MAP.default;
                return (
                  <div
                    key={ev.id}
                    className="flex items-start gap-3 px-5 py-4 hover:bg-zinc-900/40
                      transition-colors animate-slide-up"
                  >
                    <div className={cn("mt-0.5 shrink-0 rounded-lg p-2", cls)}>
                      <Icon size={12} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-zinc-300 leading-snug">
                        {ev.message}
                      </p>
                      <p className="mt-1 text-[10px] text-zinc-600">
                        {timeAgo(ev.time)}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Clear */}
        {events.length > 0 && (
          <div className="border-t border-zinc-800 px-5 py-3">
            <button
              onClick={() => setEvents([])}
              className="text-xs text-zinc-600 hover:text-zinc-400 transition-colors"
            >
              Clear all events
            </button>
          </div>
        )}
      </div>
    </>
  );
};

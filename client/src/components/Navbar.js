import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Building2,
  FolderKanban,
  LayoutList,
  CalendarCheck,
  Zap,
  LogOut,
  Shield,
  Eye,
} from "lucide-react";
import { cn } from "../lib/utils";
import { useAuthStore } from "../store/authStore";

const navItems = [
  { label: "Dashboard", path: "/", icon: LayoutDashboard },
  { label: "Employees", path: "/employees", icon: Users },
  { label: "Departments", path: "/departments", icon: Building2 },
  { label: "Projects", path: "/projects", icon: FolderKanban },
  { label: "Tasks", path: "/tasks", icon: LayoutList },
  { label: "Attendance", path: "/attendance", icon: CalendarCheck },
];

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout, isAdmin } = useAuthStore();
  const handleLogout = () => {
    logout();
    navigate("/login");
  };
  const initials =
    user?.name
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2) || "U";

  return (
    <header className="sticky top-0 z-50 border-b border-zinc-800 bg-zinc-950/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-screen-xl items-center justify-between px-6 py-3">
        <Link to="/" className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent">
            <Zap size={16} className="text-white" />
          </div>
          <span className="text-base font-semibold tracking-tight text-zinc-100">
            Trakify
          </span>
        </Link>
        <nav className="hidden md:flex items-center gap-1">
          {navItems.map(({ label, path, icon: Icon }) => {
            const active = location.pathname === path;
            return (
              <Link
                key={path}
                to={path}
                className={cn(
                  "flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-150",
                  active
                    ? "bg-zinc-800 text-zinc-100"
                    : "text-zinc-500 hover:bg-zinc-800/60 hover:text-zinc-300",
                )}
              >
                <Icon size={14} />
                {label}
              </Link>
            );
          })}
        </nav>
        <div className="flex items-center gap-3">
          <span
            className={cn(
              "hidden sm:inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-[10px] font-medium",
              isAdmin()
                ? "bg-violet-500/15 text-violet-400"
                : "bg-zinc-800 text-zinc-500",
            )}
          >
            {isAdmin() ? <Shield size={10} /> : <Eye size={10} />}
            {user?.role || "viewer"}
          </span>
          <div className="flex items-center gap-2 rounded-lg border border-zinc-800 bg-zinc-900 px-2.5 py-1.5">
            <div className="h-6 w-6 rounded-full bg-accent/20 flex items-center justify-center text-[10px] font-semibold text-accent">
              {initials}
            </div>
            <span className="hidden sm:block text-xs text-zinc-400 max-w-[100px] truncate">
              {user?.name || user?.email}
            </span>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 rounded-lg px-2.5 py-2 text-xs text-zinc-600 hover:text-red-400 hover:bg-red-500/10 transition-all"
          >
            <LogOut size={13} />
          </button>
        </div>
      </div>
      <div className="flex md:hidden border-t border-zinc-800 overflow-x-auto">
        {navItems.map(({ label, path, icon: Icon }) => {
          const active = location.pathname === path;
          return (
            <Link
              key={path}
              to={path}
              className={cn(
                "flex flex-1 flex-col items-center gap-1 py-2.5 text-[10px] font-medium transition-colors",
                active
                  ? "text-accent border-t-2 border-accent -mt-px"
                  : "text-zinc-600 hover:text-zinc-300",
              )}
            >
              <Icon size={16} />
              {label}
            </Link>
          );
        })}
      </div>
    </header>
  );
};

export default Navbar;

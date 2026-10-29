import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  TriangleAlert,
  Map,
  Users,
  BarChart3,
  Settings,
  LogOut,
} from "lucide-react";

function AdminSidebar() {
  const navigate = useNavigate();

  const menu = [
    { name: "Dashboard", icon: <LayoutDashboard size={20} />, to: "/admin" },
    { name: "Incidents", icon: <TriangleAlert size={20} />, to: "/admin" },
    { name: "Responders", icon: <Users size={20} />, to: "/admin/responders" },
    { name: "Live Map", icon: <Map size={20} />, to: "/admin/live-map" },
    { name: "Analytics", icon: <BarChart3 size={20} />, to: "/admin/analytics" },
    { name: "Settings", icon: <Settings size={20} />, to: "/admin/settings" },
  ];

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login", { replace: true });
  };

  return (
    <aside className="w-72 bg-slate-900 text-white min-h-screen flex flex-col shrink-0">
      <div className="p-8 border-b border-slate-700">
        <button
          type="button"
          onClick={() => navigate("/admin")}
          className="text-left"
          title="Go to Dashboard"
        >
          <h1 className="text-3xl font-bold text-red-500">🚑 ResQAI</h1>
          <p className="text-slate-400 mt-2">Admin Command Center</p>
        </button>
      </div>

      <nav className="flex-1 mt-6" aria-label="Admin navigation">
        {menu.map((item) => (
          <NavLink
            key={item.name}
            to={item.to}
            end={item.name === "Dashboard" || item.name === "Incidents"}
            className={({ isActive }) =>
              `flex items-center gap-4 px-8 py-4 transition ${
                isActive
                  ? "bg-red-600 text-white"
                  : "text-slate-200 hover:bg-slate-800 hover:text-white"
              }`
            }
          >
            {item.icon}
            <span>{item.name}</span>
          </NavLink>
        ))}
      </nav>

      <button
        type="button"
        onClick={logout}
        className="m-6 bg-red-600 rounded-xl py-3 font-semibold hover:bg-red-700 transition"
      >
        <LogOut className="inline mr-2" size={18} />
        Logout
      </button>
    </aside>
  );
}

export default AdminSidebar;

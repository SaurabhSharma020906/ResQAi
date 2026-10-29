import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Siren,
  Map,
  Ambulance,
  BarChart3,
  Users,
  Settings,
  LogOut,
} from "lucide-react";

function Sidebar() {
  const location = useLocation();

  const menus = [
    {
      title: "Dashboard",
      icon: <LayoutDashboard size={20} />,
      path: "/dashboard",
    },
    {
      title: "Incidents",
      icon: <Siren size={20} />,
      path: "/my-incidents",
    },
    {
      title: "Live Map",
      icon: <Map size={20} />,
      path: "/dashboard",
    },
    {
      title: "Responders",
      icon: <Ambulance size={20} />,
      path: "#",
    },
    {
      title: "Analytics",
      icon: <BarChart3 size={20} />,
      path: "#",
    },
    {
      title: "Users",
      icon: <Users size={20} />,
      path: "#",
    },
    {
      title: "Settings",
      icon: <Settings size={20} />,
      path: "#",
    },
  ];

  const logout = () => {
    localStorage.clear();
    window.location.href = "/login";
  };

  return (
    <aside className="w-72 h-screen bg-slate-900 text-white fixed left-0 top-0 shadow-2xl">

      <div className="p-6 border-b border-slate-700">

        <h1 className="text-3xl font-bold">
          🚑 ResQAI
        </h1>

        <p className="text-slate-400 text-sm mt-1">
          Emergency Command Center
        </p>

      </div>

      <nav className="mt-6">

        {menus.map((menu) => (

          <Link
            key={menu.title}
            to={menu.path}
            className={`flex items-center gap-4 px-6 py-4 transition-all hover:bg-red-600

            ${
              location.pathname === menu.path
                ? "bg-red-600"
                : ""
            }`}
          >
            {menu.icon}

            <span>{menu.title}</span>

          </Link>

        ))}

      </nav>

      <button
        onClick={logout}
        className="absolute bottom-6 left-6 right-6 bg-red-600 hover:bg-red-700 rounded-xl py-3 flex items-center justify-center gap-3"
      >
        <LogOut size={20} />

        Logout
      </button>

    </aside>
  );
}

export default Sidebar;
import { Bell, Search, CalendarDays } from "lucide-react";

function Topbar({ user }) {
  const today = new Date().toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <header className="h-20 bg-white shadow-md rounded-2xl flex items-center justify-between px-8">

      {/* Left Side */}
      <div>
        <h1 className="text-3xl font-bold text-slate-800">
          🚑 Emergency Dashboard
        </h1>

        <div className="flex items-center gap-2 text-gray-500 mt-1">
          <CalendarDays size={16} />
          <span>{today}</span>
        </div>
      </div>

      {/* Right Side */}
      <div className="flex items-center gap-6">

        {/* Search */}
        <div className="flex items-center bg-slate-100 rounded-xl px-4 py-2 w-72">
          <Search size={18} className="text-gray-500" />

          <input
            type="text"
            placeholder="Search incidents..."
            className="bg-transparent outline-none ml-3 w-full"
          />
        </div>

        {/* Notification */}
        <button className="relative p-3 rounded-xl bg-slate-100 hover:bg-slate-200 transition">
          <Bell size={22} />

          <span className="absolute top-1 right-1 h-3 w-3 rounded-full bg-red-500"></span>
        </button>

        {/* User */}
        <div className="flex items-center gap-3">

          <div className="h-12 w-12 rounded-full bg-red-600 text-white flex items-center justify-center font-bold text-lg">
            {user?.fullName?.charAt(0) || "U"}
          </div>

          <div>
            <h3 className="font-semibold">
              {user?.fullName}
            </h3>

            <p className="text-sm text-gray-500">
              {user?.role}
            </p>
          </div>

        </div>

      </div>

    </header>
  );
}

export default Topbar;
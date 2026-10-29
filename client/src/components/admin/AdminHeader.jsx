import { Bell, Search } from "lucide-react";

function AdminHeader({ user }) {
  const today = new Date().toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="bg-white rounded-2xl shadow-md px-8 py-6 flex items-center justify-between mb-8">

      <div>
        <h1 className="text-4xl font-bold text-slate-800">
          🚑 Admin Dashboard
        </h1>

        <p className="text-slate-500 mt-2">
          {today}
        </p>
      </div>

      <div className="flex items-center gap-5">

        <div className="relative">

          <Search
            className="absolute left-4 top-3 text-gray-400"
            size={20}
          />

          <input
            placeholder="Search incidents..."
            className="pl-12 pr-4 py-3 rounded-xl border w-80 focus:outline-none"
          />

        </div>

        <button className="relative p-3 rounded-xl bg-gray-100">

          <Bell size={22} />

          <span className="absolute top-2 right-2 w-3 h-3 rounded-full bg-red-500"></span>

        </button>

        <div className="flex items-center gap-3">

          <div className="w-12 h-12 rounded-full bg-red-600 text-white flex items-center justify-center text-xl font-bold">
            {user?.name?.charAt(0) || "A"}
          </div>

          <div>

            <h3 className="font-semibold">
              {user?.name || "Administrator"}
            </h3>

            <p className="text-sm text-gray-500">
              {user?.role || "Admin"}
            </p>

          </div>

        </div>

      </div>

    </div>
  );
}

export default AdminHeader;
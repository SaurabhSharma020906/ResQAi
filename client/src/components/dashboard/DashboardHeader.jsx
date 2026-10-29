import { useNavigate } from "react-router-dom";

function DashboardHeader({ user }) {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const today = new Date().toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="bg-gradient-to-r from-red-600 via-red-500 to-orange-500 text-white rounded-3xl shadow-xl p-8 mb-8">
      <div className="flex flex-col lg:flex-row justify-between items-center gap-6">
        <div>
          <h1 className="text-4xl font-bold">
            🚨 ResQAI Dashboard
          </h1>

          <p className="mt-2 text-red-100">
            Welcome back,
            <span className="font-bold"> {user?.fullName}</span>
          </p>

          <p className="mt-1 text-sm text-red-200">
            {today}
          </p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => navigate("/report-incident")}
            className="bg-white text-red-600 font-semibold px-5 py-3 rounded-xl hover:bg-red-50 transition"
          >
            🚨 Report Emergency
          </button>

          <button
            onClick={logout}
            className="bg-red-800 hover:bg-red-900 px-5 py-3 rounded-xl font-semibold transition"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}

export default DashboardHeader;
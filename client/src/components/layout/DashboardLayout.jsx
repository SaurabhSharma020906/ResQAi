import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

function DashboardLayout({ user, children }) {
  return (
    <div className="bg-slate-100 min-h-screen">

      <Sidebar />

      <div className="ml-72 p-6">

        <Topbar user={user} />

        <div className="mt-6">
          {children}
        </div>

      </div>

    </div>
  );
}

export default DashboardLayout;
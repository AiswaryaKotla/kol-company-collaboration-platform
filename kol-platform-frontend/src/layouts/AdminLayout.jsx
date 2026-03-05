import { Link, Outlet } from "react-router-dom";

function AdminLayout() {

  return (
    <div className="flex h-screen">

      {/* SIDEBAR */}

      <div className="w-60 bg-white shadow-md p-5 space-y-4">

        <h1 className="text-xl font-bold mb-6">
          KOL Platform
        </h1>

        <nav className="space-y-2">

          <Link
            to="/admin/dashboard"
            className="block px-3 py-2 rounded hover:bg-gray-100 "
          >
            Dashboard
          </Link>

          <Link
            to="/admin/verify-social"
            className="block px-3 py-2 rounded hover:bg-gray-100 "
          >
            Verify Accounts
          </Link>

        </nav>

      </div>

      {/* PAGE CONTENT */}

      <div className="flex-1 p-6 bg-gray-50 overflow-auto">

        <Outlet />

      </div>

    </div>
  );
}

export default AdminLayout;
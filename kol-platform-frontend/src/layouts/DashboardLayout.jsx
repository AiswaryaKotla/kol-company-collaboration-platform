import { useState } from "react";
import { Outlet, NavLink } from "react-router-dom";
import { useAuth } from "../store/AuthContext";
import NotificationBell from "../components/notifications/NotificationBell";
import DarkModeToggle from "../components/DarkModeToggle";

function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const { user, logout } = useAuth();

  const roleBase =
    user?.role === "company"
      ? "/company"
      : user?.role === "admin"
      ? "/admin"
      : "/kol";

  const navItem =
    "block px-3 py-2 rounded-lg text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition";

  const activeItem =
    "block px-3 py-2 rounded-lg bg-blue-100 text-blue-600 font-medium";

  const notifications = [
    { id: 1, text: "New campaign invitation received" },
    { id: 2, text: "Payment released successfully" },
    { id: 3, text: "Profile viewed by a company" },
  ];

  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* 🔹 Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* 🔹 Sidebar */}
      <aside
        className={`
          fixed md:static z-50
          top-0 left-0 h-full w-64
          bg-white shadow-md p-5
          transform transition-transform duration-300
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0
        `}
      >
        <h2 className="text-xl font-bold mb-6">KOL Platform</h2>

        <nav className="space-y-2">
            {user?.role === "company" && (
  <NavLink
    to="/company/create-campaign"
    className={({ isActive }) =>
      isActive ? activeItem : navItem
    }
  >
    Create Campaign
  </NavLink>
)}

{user?.role === "company" && (
  <NavLink
    to="/company/kols"
    className={({ isActive }) =>
      isActive ? activeItem : navItem
    }
  >
    Browse KOLs
  </NavLink>
)}

{user?.role === "company" && (
  <NavLink
    to="/company/campaigns"
    className={({ isActive }) =>
      isActive ? activeItem : navItem
    }
  >
    Campaigns
  </NavLink>
)}

{user?.role === "kol" && (
  <NavLink
    to="/kol/collaborations"
    className={({ isActive }) =>
      isActive ? activeItem : navItem
    }
  >
    Invitations
  </NavLink>
)}

          {/* Dashboard */}
          <NavLink
            to={`${roleBase}/dashboard`}
            className={({ isActive }) =>
              isActive ? activeItem : navItem
            }
            onClick={() => setSidebarOpen(false)}
          >
            Dashboard
          </NavLink>

          {/* Profile */}
          <NavLink
            to={`${roleBase}/profile`}
            className={({ isActive }) =>
              isActive ? activeItem : navItem
            }
            onClick={() => setSidebarOpen(false)}
          >
            Profile
          </NavLink>

          {/* ⭐ KOL ONLY — Social Accounts */}
          {user?.role === "kol" && (
            <NavLink
              to="/kol/social-accounts"
              className={({ isActive }) =>
                isActive ? activeItem : navItem
              }
              onClick={() => setSidebarOpen(false)}
            >
              Social Accounts
            </NavLink>
          )}

          {/* Messages */}
          <NavLink
            to={`${roleBase}/messages`}
            className={({ isActive }) =>
              isActive ? activeItem : navItem
            }
            onClick={() => setSidebarOpen(false)}
          >
            Messages
          </NavLink>

          {/* Wallet */}
          <NavLink
            to={`${roleBase}/wallet`}
            className={({ isActive }) =>
              isActive ? activeItem : navItem
            }
            onClick={() => setSidebarOpen(false)}
          >
            Wallet
          </NavLink>
        </nav>
      </aside>

      {/*  Main Area */}
      <div className="flex-1 flex flex-col">
        {/*  Topbar */}
        <header className="bg-white shadow-sm px-6 py-4 flex items-center justify-between">
          {/* Left: Hamburger */}
          <button
            className="md:hidden text-2xl"
            onClick={() => setSidebarOpen(true)}
          >
            ☰
          </button>

          {/* Center: Title */}
          <h1 className="text-lg font-semibold capitalize">
            {user?.role?.toUpperCase()} Dashboard
          </h1>

          {/* Right: Notifications + Logout */}
          <div className="flex items-center gap-4 relative">
            {/*  Notification Bell */}
            <button
              onClick={() =>
                setShowNotifications(!showNotifications)
              }
              className="relative text-xl"
            >
              🔔
              <span className="absolute -top-1 -right-2 bg-red-500 text-white text-xs px-1.5 rounded-full">
                {notifications.length}
              </span>
            </button>

            {/*  Notification Dropdown */}
            {showNotifications && (
              <div className="absolute right-14 top-12 w-72 bg-white shadow-lg rounded-xl p-3 z-50">
                <h4 className="font-semibold mb-2">
                  Notifications
                </h4>

                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {notifications.map((n) => (
                    <div
                      key={n.id}
                      className="text-sm p-2 rounded-lg hover:bg-gray-100"
                    >
                      {n.text}
                    </div>
                  ))}
                </div>
              </div>
            )}
            {/*  Logout */}
            <button
              onClick={logout}
              className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg text-sm"
            >
              Logout
            </button>
          </div>
        </header>

        {/* 🔹 Page Content */}
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default DashboardLayout;
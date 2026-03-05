import { useEffect, useRef, useState } from "react";
import {
  getUnreadCount,
  getUserNotifications,
  markNotificationRead,
} from "../../utils/notificationStore";
import { useAuth } from "../../store/AuthContext";

function NotificationBell() {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const panelRef = useRef();

  //  load notifications
  const loadNotifications = () => {
    if (!user?.email) return;

    const data = getUserNotifications(user.email);
    setNotifications(data);
  };

  useEffect(() => {
    loadNotifications();
  }, [user]);

  //  outside click close
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (panelRef.current && !panelRef.current.contains(e.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const unreadCount = getUnreadCount(user?.email);

  //  mark read
  const handleRead = (id) => {
    markNotificationRead(id);
    loadNotifications();
  };

  return (
    <div className="relative" ref={panelRef}>
      {/*  Bell */}
      <button
        onClick={() => setOpen((p) => !p)}
        className="relative text-xl"
      >
        🔔

        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-2 bg-red-500 text-white text-xs px-1.5 rounded-full">
            {unreadCount}
          </span>
        )}
      </button>

      {/*  Panel */}
      {open && (
        <div className="absolute right-0 mt-3 w-80 bg-white rounded-xl shadow-lg border z-50 max-h-96 overflow-y-auto">
          <div className="p-3 border-b font-semibold">
            Notifications
          </div>

          {notifications.length === 0 ? (
            <div className="p-6 text-center text-gray-500 text-sm">
              No notifications yet
            </div>
          ) : (
            notifications.map((n) => (
              <div
                key={n.id}
                onClick={() => handleRead(n.id)}
                className={`p-3 text-sm border-b cursor-pointer hover:bg-gray-50 ${
                  !n.read ? "bg-blue-50" : ""
                }`}
              >
                <div className="font-medium">{n.title}</div>
                <div className="text-gray-500 text-xs">
                  {n.message}
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

export default NotificationBell;
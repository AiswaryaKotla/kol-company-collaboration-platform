const KEY = "notifications";

// get all
export function getNotifications() {
  return JSON.parse(localStorage.getItem(KEY) || "[]");
}

// add notification
export function addNotification(notification) {
  const all = getNotifications();

  all.unshift({
    id: Date.now(),
    read: false,
    createdAt: new Date().toISOString(),
    ...notification,
  });

  localStorage.setItem(KEY, JSON.stringify(all));
}

// mark read
export function markNotificationRead(id) {
  const all = getNotifications().map((n) =>
    n.id === id ? { ...n, read: true } : n
  );

  localStorage.setItem(KEY, JSON.stringify(all));
}

// unread count
export function getUnreadCount(userEmail) {
  return getNotifications().filter(
    (n) => n.userEmail === userEmail && !n.read
  ).length;
}

// notifications for user
export function getUserNotifications(userEmail) {
  return getNotifications().filter(
    (n) => n.userEmail === userEmail
  );
}
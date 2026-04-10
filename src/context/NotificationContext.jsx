import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { useAuth } from "../hooks/useAuth";

export const NotificationContext = createContext();

export function NotificationProvider({ children }) {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (user) {
      fetchNotifications();
      subscribeToNotifications();
    }
  }, [user]);

  async function fetchNotifications() {
    const { data } = await supabase
      .from("notifications")
      .select("*")
      .order("created_at", { ascending: false });

    setNotifications(data || []);

    const unread = data?.filter((n) => !n.is_read).length || 0;
    setUnreadCount(unread);
  }

  function subscribeToNotifications() {
    // supabase
    //   .channel("notifications")
    //   .on(
    //     "postgres_changes",
    //     { event: "INSERT", schema: "public", table: "notifications" },
    //     (payload) => {
    //       setNotifications((prev) => [payload.new, ...prev]);
    //       setUnreadCount((prev) => prev + 1);
    //     }
    //   )
    //   .subscribe();
    const channel = supabase
  .channel("notifications")
  .on(
    "postgres_changes",
    {
      event: "INSERT",
      schema: "public",
      table: "notifications",
    },
    (payload) => {
      console.log("New notification:", payload);
    }
  )
  .subscribe();
  }

  async function markAsRead(id) {
    await supabase
      .from("notifications")
      .update({ is_read: true })
      .eq("id", id);

    fetchNotifications();
  }

  return (
    <NotificationContext.Provider
      value={{ notifications, unreadCount, markAsRead }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  return useContext(NotificationContext);
}
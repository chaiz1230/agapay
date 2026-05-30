"use client";

import React, { useState, useEffect, useRef } from "react";
import { Bell } from "lucide-react";
import { useRouter, usePathname } from "next/navigation";

interface Notification {
  id: string;
  message: string;
  read: boolean;
  createdAt: string;
}

export default function NotificationBell() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const pathname = usePathname();

  // Poll notifications
  const fetchNotifications = async () => {
    try {
      const res = await fetch("/api/notifications");
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) {
          setNotifications(data);
        }
      }
    } catch (err) {
      console.error("Error fetching notifications:", err);
    }
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 4000);
    return () => clearInterval(interval);
  }, []);

  // Close on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleMarkAsRead = async (id: string) => {
    try {
      // Optimistic update
      setNotifications((prev) => prev.filter((n) => n.id !== id));
      setIsOpen(false);

      const res = await fetch("/api/notifications", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }),
      });

      if (!res.ok) {
        // Sync if failed
        fetchNotifications();
      }

      // Redirect user to their respective appointments page
      if (pathname.startsWith("/doctor")) {
        router.push("/doctor/appointments");
      } else if (pathname.startsWith("/patient")) {
        router.push("/patient/appointments");
      }
    } catch (err) {
      console.error("Failed to mark notification as read:", err);
      fetchNotifications();
    }
  };

  const unreadCount = notifications.length;

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Icon Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-slate-500 hover:text-[#0a5c5f] hover:bg-[#0a5c5f]/5 rounded-xl transition-all focus:outline-none"
        aria-label="Notifications"
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white ring-2 ring-white animate-pulse">
            {unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 md:left-0 md:right-auto mt-2 w-80 bg-white rounded-2xl shadow-xl border border-slate-100 py-3 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="px-4 pb-2 border-b border-slate-100 flex items-center justify-between">
            <span className="font-bold text-slate-800 text-sm">Notifications</span>
            {unreadCount > 0 && (
              <span className="text-[10px] bg-rose-50 text-rose-600 px-2 py-0.5 rounded-full font-bold">
                {unreadCount} Unread
              </span>
            )}
          </div>

          <div className="max-h-72 overflow-y-auto mt-2 px-2 space-y-1">
            {notifications.length === 0 ? (
              <div className="px-4 py-8 text-center text-slate-400 text-sm font-medium">
                No new notifications
              </div>
            ) : (
              notifications.map((notif) => (
                <button
                  key={notif.id}
                  onClick={() => handleMarkAsRead(notif.id)}
                  className="w-full text-left px-3 py-2.5 rounded-xl hover:bg-slate-50 active:bg-slate-100 transition-colors flex flex-col gap-1 focus:outline-none"
                >
                  <p className="text-xs text-slate-700 font-medium leading-relaxed">
                    {notif.message}
                  </p>
                  <span className="text-[9px] text-slate-400 font-semibold uppercase tracking-wider">
                    {new Date(notif.createdAt).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}

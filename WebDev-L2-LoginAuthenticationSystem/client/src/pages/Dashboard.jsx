import React, { useState, useMemo, useRef, useEffect } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Activity,
  Settings as SettingsIcon,
  BarChart3,
  Users as UsersIcon,
  Search,
  Bell,
  ChevronDown,
  Menu,
  X,
  Shield,
  ShieldCheck,
  LogOut,
  UserPlus,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Clock,
  Eye,
  EyeOff,
  ArrowUpRight,
  ArrowDownRight,
  ChevronRight,
} from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
} from "recharts";

/* ============================================================
   Mock data
   ============================================================ */

const WORKSPACE = "Northfield Studio";

const NAV_ITEMS = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "activity", label: "Activity", icon: Activity },
  { id: "settings", label: "Settings", icon: SettingsIcon },
  { id: "analytics", label: "Analytics", icon: BarChart3 },
  { id: "users", label: "Users", icon: UsersIcon },
];

const AVATAR_COLORS = [
  "bg-indigo-500",
  "bg-violet-500",
  "bg-sky-500",
  "bg-emerald-500",
  "bg-amber-500",
  "bg-rose-500",
  "bg-teal-500",
  "bg-fuchsia-500",
];

function initialsOf(name) {
  return name
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

const RAW_USERS = [
  { id: 1, name: "Amelia Rhodes", email: "amelia@northfield.co", role: "Owner", status: "Active", joined: "Jan 12, 2024", lastActive: "2 minutes ago", sessions: 3 },
  { id: 2, name: "Marcus Chen", email: "marcus.chen@northfield.co", role: "Admin", status: "Active", joined: "Jan 18, 2024", lastActive: "11 minutes ago", sessions: 2 },
  { id: 3, name: "Priya Nandakumar", email: "priya.n@northfield.co", role: "Editor", status: "Active", joined: "Feb 2, 2024", lastActive: "1 hour ago", sessions: 1 },
  { id: 4, name: "Diego Ferreira", email: "diego.f@northfield.co", role: "Editor", status: "Active", joined: "Feb 9, 2024", lastActive: "3 hours ago", sessions: 1 },
  { id: 5, name: "Sofia Kowalski", email: "sofia.k@northfield.co", role: "Viewer", status: "Invited", joined: "—", lastActive: "Never", sessions: 0 },
  { id: 6, name: "Elena Petrova", email: "elena.petrova@northfield.co", role: "Admin", status: "Active", joined: "Mar 4, 2024", lastActive: "26 minutes ago", sessions: 2 },
  { id: 7, name: "Jamal Whitfield", email: "jamal.w@northfield.co", role: "Viewer", status: "Suspended", joined: "Mar 15, 2024", lastActive: "9 days ago", sessions: 0 },
  { id: 8, name: "Hana Osei", email: "hana.osei@northfield.co", role: "Editor", status: "Active", joined: "Apr 1, 2024", lastActive: "5 hours ago", sessions: 1 },
  { id: 9, name: "Tomás Reyes", email: "tomas.reyes@northfield.co", role: "Viewer", status: "Active", joined: "Apr 22, 2024", lastActive: "2 days ago", sessions: 1 },
  { id: 10, name: "Nadia Rahman", email: "nadia.rahman@northfield.co", role: "Admin", status: "Invited", joined: "—", lastActive: "Never", sessions: 0 },
  { id: 11, name: "Liam Fitzgerald", email: "liam.f@northfield.co", role: "Viewer", status: "Active", joined: "May 6, 2024", lastActive: "4 hours ago", sessions: 1 },
  { id: 12, name: "Grace Adeyemi", email: "grace.a@northfield.co", role: "Editor", status: "Suspended", joined: "May 20, 2024", lastActive: "16 days ago", sessions: 0 },
];

const USERS = RAW_USERS.map((u, i) => ({
  ...u,
  color: AVATAR_COLORS[i % AVATAR_COLORS.length],
  initials: initialsOf(u.name),
}));

const ACTIVITY_LOGS = [
  { id: 1, user: "Amelia Rhodes", action: "Signed in", type: "Authentication", status: "success", time: "2 minutes ago", ip: "103.221.14.6", device: "Chrome on macOS", location: "Karachi, PK" },
  { id: 2, user: "Unknown", action: "Failed login attempt (3 tries)", type: "Authentication", status: "failed", time: "14 minutes ago", ip: "41.203.72.19", device: "Safari on iOS", location: "Lagos, NG" },
  { id: 3, user: "Marcus Chen", action: "Enabled two-factor authentication", type: "Security", status: "success", time: "32 minutes ago", ip: "88.12.44.201", device: "Firefox on Windows", location: "Berlin, DE" },
  { id: 4, user: "Elena Petrova", action: "Generated a new API key", type: "Security", status: "success", time: "48 minutes ago", ip: "176.59.10.3", device: "Chrome on Windows", location: "Warsaw, PL" },
  { id: 5, user: "Jamal Whitfield", action: "Account suspended by admin", type: "Account", status: "warning", time: "1 hour ago", ip: "—", device: "—", location: "—" },
  { id: 6, user: "Priya Nandakumar", action: "Password changed", type: "Account", status: "success", time: "2 hours ago", ip: "202.83.19.44", device: "Chrome on Android", location: "Chennai, IN" },
  { id: 7, user: "Diego Ferreira", action: "Revoked a session (Firefox, Windows)", type: "Security", status: "success", time: "3 hours ago", ip: "187.44.9.201", device: "Chrome on macOS", location: "São Paulo, BR" },
  { id: 8, user: "Sofia Kowalski", action: "Invitation sent", type: "Account", status: "success", time: "5 hours ago", ip: "—", device: "—", location: "—" },
  { id: 9, user: "Unknown", action: "Failed login — Tor exit node detected", type: "Security", status: "failed", time: "6 hours ago", ip: "185.220.101.4", device: "Unknown", location: "Unknown" },
  { id: 10, user: "Tomás Reyes", action: "Signed in", type: "Authentication", status: "success", time: "8 hours ago", ip: "190.2.55.18", device: "Safari on macOS", location: "Mexico City, MX" },
  { id: 11, user: "Liam Fitzgerald", action: "Updated billing details", type: "Account", status: "success", time: "10 hours ago", ip: "82.19.203.5", device: "Chrome on Windows", location: "Dublin, IE" },
  { id: 12, user: "Grace Adeyemi", action: "Account suspended by admin", type: "Account", status: "warning", time: "1 day ago", ip: "—", device: "—", location: "—" },
  { id: 13, user: "Marcus Chen", action: "Changed role: Editor to Admin", type: "Account", status: "success", time: "1 day ago", ip: "88.12.44.201", device: "Firefox on Windows", location: "Berlin, DE" },
  { id: 14, user: "Amelia Rhodes", action: "Downloaded compliance report", type: "Data", status: "success", time: "2 days ago", ip: "103.221.14.6", device: "Chrome on macOS", location: "Karachi, PK" },
  { id: 15, user: "Nadia Rahman", action: "Invitation sent", type: "Account", status: "success", time: "2 days ago", ip: "—", device: "—", location: "—" },
  { id: 16, user: "Hana Osei", action: "Exported audit log (CSV)", type: "Data", status: "success", time: "3 days ago", ip: "41.90.12.66", device: "Chrome on Windows", location: "Accra, GH" },
];

const INITIAL_NOTIFICATIONS = [
  { id: 1, title: "3 failed login attempts detected", desc: "New location: Lagos, NG — review recommended", time: "14m ago", unread: true },
  { id: 2, title: "Nadia Rahman accepted your invite", desc: "Joined as Admin", time: "2h ago", unread: true },
  { id: 3, title: "New API key generated", desc: "Created by Elena Petrova", time: "6h ago", unread: true },
  { id: 4, title: "Weekly security digest is ready", desc: "94/100 security score this week", time: "1d ago", unread: false },
  { id: 5, title: "Password changed successfully", desc: "Priya Nandakumar updated their password", time: "2d ago", unread: false },
];

const SESSIONS_TREND = [
  { day: "Mon", sessions: 812 },
  { day: "Tue", sessions: 940 },
  { day: "Wed", sessions: 880 },
  { day: "Thu", sessions: 1020 },
  { day: "Fri", sessions: 1180 },
  { day: "Sat", sessions: 760 },
  { day: "Sun", sessions: 1284 },
];

const TRAFFIC_SOURCES = [
  { source: "Direct", value: 4210 },
  { source: "Organic Search", value: 3180 },
  { source: "Referral", value: 1890 },
  { source: "Social", value: 1240 },
  { source: "Email", value: 960 },
];

const GROWTH_DATA = [
  { month: "Apr", signups: 320 },
  { month: "May", signups: 410 },
  { month: "Jun", signups: 468 },
  { month: "Jul", signups: 512 },
  { month: "Aug", signups: 590 },
  { month: "Sep", signups: 642 },
];

const FUNNEL_DATA = [
  { stage: "Visited site", value: 12480 },
  { stage: "Started signup", value: 4210 },
  { stage: "Verified email", value: 3350 },
  { stage: "Completed onboarding", value: 2680 },
  { stage: "Active after 7 days", value: 1890 },
];

const PIE_COLORS = ["#818cf8", "#a78bfa", "#38bdf8", "#34d399", "#fbbf24"];

const CHART_TOOLTIP_STYLE = {
  background: "#0f172a",
  border: "1px solid #1e293b",
  borderRadius: 8,
  color: "#e2e8f0",
  fontSize: 13,
};

/* ============================================================
   Small shared building blocks
   ============================================================ */

const STATUS_STYLES = {
  success: "bg-emerald-950 text-emerald-400 border border-emerald-800",
  Active: "bg-emerald-950 text-emerald-400 border border-emerald-800",
  failed: "bg-rose-950 text-rose-400 border border-rose-800",
  Suspended: "bg-rose-950 text-rose-400 border border-rose-800",
  warning: "bg-amber-950 text-amber-400 border border-amber-800",
  Invited: "bg-amber-950 text-amber-400 border border-amber-800",
};

const STATUS_DOT = {
  success: "bg-emerald-950 text-emerald-400",
  failed: "bg-rose-950 text-rose-400",
  warning: "bg-amber-950 text-amber-400",
};

const ROLE_STYLES = {
  Owner: "bg-violet-950 text-violet-300 border border-violet-800",
  Admin: "bg-indigo-950 text-indigo-300 border border-indigo-800",
  Editor: "bg-sky-950 text-sky-300 border border-sky-800",
  Viewer: "bg-slate-800 text-slate-300 border border-slate-700",
};

function statusIcon(status) {
  if (status === "success" || status === "Active") return <CheckCircle2 className="w-3.5 h-3.5" />;
  if (status === "failed" || status === "Suspended") return <XCircle className="w-3.5 h-3.5" />;
  return <AlertTriangle className="w-3.5 h-3.5" />;
}

function StatusBadge({ value }) {
  const cls = STATUS_STYLES[value] || "bg-slate-800 text-slate-300 border border-slate-700";
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium whitespace-nowrap ${cls}`}>
      {statusIcon(value)}
      {value}
    </span>
  );
}

function RoleBadge({ role }) {
  return (
    <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium whitespace-nowrap ${ROLE_STYLES[role] || ROLE_STYLES.Viewer}`}>
      {role}
    </span>
  );
}

function Toggle({ label, description, checked, onChange }) {
  return (
    <div className="flex items-center justify-between gap-4 py-4">
      <div>
        <p className="text-sm font-medium text-slate-200">{label}</p>
        {description && <p className="text-sm text-slate-500 mt-0.5">{description}</p>}
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors duration-200 ${
          checked ? "bg-indigo-500" : "bg-slate-700"
        }`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ${
            checked ? "translate-x-6" : "translate-x-1"
          }`}
        />
      </button>
    </div>
  );
}

function Modal({ open, onClose, title, children }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-950 bg-opacity-70" onClick={onClose} />
      <div className="relative bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 sticky top-0 bg-slate-900">
          <h3 className="text-slate-100 font-semibold">{title}</h3>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-300 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="px-6 py-5">{children}</div>
      </div>
    </div>
  );
}

function SlideOver({ open, onClose, title, children }) {
  return (
    <div className={`fixed inset-0 z-50 ${open ? "" : "pointer-events-none"}`}>
      <div
        className={`absolute inset-0 bg-slate-950 bg-opacity-70 transition-opacity duration-300 ${
          open ? "opacity-100" : "opacity-0"
        }`}
        onClick={onClose}
      />
      <div
        className={`absolute right-0 top-0 h-full w-full max-w-md bg-slate-900 border-l border-slate-800 shadow-2xl transition-transform duration-300 flex flex-col ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 shrink-0">
          <h3 className="text-slate-100 font-semibold">{title}</h3>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-300 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="px-6 py-5 overflow-y-auto flex-1">{children}</div>
      </div>
    </div>
  );
}

/* ============================================================
   Sidebar
   ============================================================ */

function Sidebar({ active, onNavigate, mobileOpen, onCloseMobile, currentUser }) {
  return (
    <>
      <div
        className={`fixed inset-0 bg-slate-950 bg-opacity-70 z-40 md:hidden transition-opacity ${
          mobileOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={onCloseMobile}
      />
      <aside
        className={`fixed md:static inset-y-0 left-0 z-50 w-64 bg-slate-900 border-r border-slate-800 flex flex-col transition-transform duration-300 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0`}
      >
        <div className="flex items-center gap-2.5 px-5 h-16 border-b border-slate-800 shrink-0">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center shrink-0">
            <Shield className="w-4 h-4 text-white" />
          </div>
          <span className="font-semibold text-slate-100">SecureAuth</span>
          <button className="ml-auto md:hidden text-slate-500 hover:text-slate-300" onClick={onCloseMobile}>
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = active === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-gradient-to-r from-indigo-500 to-violet-500 text-white shadow-lg"
                    : "text-slate-400 hover:text-slate-100 hover:bg-slate-800"
                }`}
              >
                <Icon className="w-4 h-4" />
                {item.label}
              </button>
            );
          })}
        </nav>

        <div className="px-3 py-4 border-t border-slate-800 shrink-0">
          <div className="flex items-center gap-3 px-3 py-2 rounded-lg bg-slate-800">
            <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center text-xs font-semibold text-white shrink-0">
              {currentUser.initials}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium text-slate-100 truncate">{currentUser.name}</p>
              <p className="text-xs text-slate-500 truncate">{currentUser.email}</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}

/* ============================================================
   Top bar (search, notifications, user menu)
   ============================================================ */

function TopBar({
  onOpenMobileSidebar,
  query,
  setQuery,
  searchOpen,
  setSearchOpen,
  searchResults,
  searchRef,
  onSelectUser,
  onSelectLog,
  notifOpen,
  setNotifOpen,
  notifRef,
  notifications,
  unreadCount,
  onMarkAllRead,
  userMenuOpen,
  setUserMenuOpen,
  userMenuRef,
  currentUser,
  onLogout,
}) {
  const hasResults = searchResults.users.length > 0 || searchResults.logs.length > 0;

  return (
    <header className="h-16 border-b border-slate-800 bg-slate-950 flex items-center gap-3 px-4 sm:px-6 sticky top-0 z-30 shrink-0">
      <button onClick={onOpenMobileSidebar} className="md:hidden text-slate-400 hover:text-slate-200">
        <Menu className="w-5 h-5" />
      </button>

      <div ref={searchRef} className="relative flex-1 max-w-md">
        <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
        <input
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setSearchOpen(true);
          }}
          onFocus={() => setSearchOpen(true)}
          placeholder="Search users, activity..."
          className="w-full bg-slate-900 border border-slate-800 rounded-lg pl-9 pr-3 py-2 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
        />
        {searchOpen && query.trim() && (
          <div className="absolute mt-2 w-full bg-slate-900 border border-slate-800 rounded-xl shadow-2xl overflow-hidden max-h-96 overflow-y-auto">
            {!hasResults && (
              <p className="px-4 py-6 text-sm text-slate-500 text-center">No matches for "{query}".</p>
            )}
            {searchResults.users.length > 0 && (
              <div className="py-2">
                <p className="px-4 py-1 text-xs font-medium text-slate-500">Users</p>
                {searchResults.users.map((u) => (
                  <button
                    key={u.id}
                    onClick={() => onSelectUser(u)}
                    className="w-full flex items-center gap-3 px-4 py-2 hover:bg-slate-800 text-left transition-colors"
                  >
                    <span className={`w-7 h-7 rounded-full ${u.color} flex items-center justify-center text-xs font-semibold text-white shrink-0`}>
                      {u.initials}
                    </span>
                    <span className="min-w-0">
                      <p className="text-sm text-slate-200 truncate">{u.name}</p>
                      <p className="text-xs text-slate-500 truncate">{u.email}</p>
                    </span>
                  </button>
                ))}
              </div>
            )}
            {searchResults.logs.length > 0 && (
              <div className="py-2 border-t border-slate-800">
                <p className="px-4 py-1 text-xs font-medium text-slate-500">Activity</p>
                {searchResults.logs.map((l) => (
                  <button
                    key={l.id}
                    onClick={() => onSelectLog(l)}
                    className="w-full flex items-center gap-3 px-4 py-2 hover:bg-slate-800 text-left transition-colors"
                  >
                    <span className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${STATUS_DOT[l.status]}`}>
                      {statusIcon(l.status)}
                    </span>
                    <span className="min-w-0">
                      <p className="text-sm text-slate-200 truncate">{l.action}</p>
                      <p className="text-xs text-slate-500 truncate">{l.user}</p>
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      <div className="ml-auto flex items-center gap-2">
        <div ref={notifRef} className="relative">
          <button
            onClick={() => setNotifOpen((o) => !o)}
            className="relative w-9 h-9 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500" />}
          </button>
          {notifOpen && (
            <div className="absolute right-0 mt-2 w-80 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl overflow-hidden">
              <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800">
                <p className="text-sm font-semibold text-slate-100">Notifications</p>
                <button onClick={onMarkAllRead} className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors">
                  Mark all read
                </button>
              </div>
              <div className="max-h-96 overflow-y-auto divide-y divide-slate-800">
                {notifications.map((n) => (
                  <div key={n.id} className={`px-4 py-3 ${n.unread ? "bg-slate-800" : ""}`}>
                    <div className="flex items-start gap-2.5">
                      {n.unread ? (
                        <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 mt-1.5 shrink-0" />
                      ) : (
                        <span className="w-1.5 h-1.5 shrink-0" />
                      )}
                      <div className="min-w-0">
                        <p className="text-sm text-slate-200">{n.title}</p>
                        <p className="text-xs text-slate-500 mt-0.5">{n.desc}</p>
                        <p className="text-xs text-slate-600 mt-1">{n.time}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div ref={userMenuRef} className="relative">
          <button
            onClick={() => setUserMenuOpen((o) => !o)}
            className="flex items-center gap-2 pl-2 pr-1 py-1 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <span className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center text-xs font-semibold text-white">
              {currentUser.initials}
            </span>
            <ChevronDown className="w-4 h-4 text-slate-500" />
          </button>
          {userMenuOpen && (
            <div className="absolute right-0 mt-2 w-52 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl overflow-hidden py-1">
              <p className="px-4 py-2 text-xs text-slate-500 border-b border-slate-800 truncate">
                Signed in as {currentUser.name}
              </p>
              <button className="w-full text-left px-4 py-2 text-sm text-slate-300 hover:bg-slate-800 transition-colors">
                Your profile
              </button>
              <button className="w-full text-left px-4 py-2 text-sm text-slate-300 hover:bg-slate-800 transition-colors">
                Workspace settings
              </button>
              <button
                onClick={onLogout}
                className="w-full text-left px-4 py-2 text-sm text-rose-400 hover:bg-slate-800 transition-colors inline-flex items-center gap-2"
              >
                <LogOut className="w-4 h-4" /> Log out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

/* ============================================================
   Dashboard page
   ============================================================ */

function DashboardPage({ onOpenLog, onNavigate }) {
  const metrics = [
    { label: "Active Sessions", value: "1,284", delta: "+8.2%", up: true, icon: Activity },
    { label: "Total Users", value: "3,946", delta: "+142 this month", up: true, icon: UsersIcon },
    { label: "Avg. Session Duration", value: "7m 52s", delta: "-3.1%", up: false, icon: Clock },
    { label: "Security Score", value: "94/100", delta: "+2 pts", up: true, icon: ShieldCheck },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-100">Dashboard</h1>
        <p className="text-slate-500 mt-1">Here's what's happening across {WORKSPACE} today.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((m) => (
          <div key={m.label} className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center">
                <m.icon className="w-5 h-5 text-indigo-400" />
              </div>
              <span className={`inline-flex items-center gap-1 text-xs font-medium ${m.up ? "text-emerald-400" : "text-rose-400"}`}>
                {m.up ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
                {m.delta}
              </span>
            </div>
            <p className="text-2xl font-semibold text-slate-100">{m.value}</p>
            <p className="text-sm text-slate-500 mt-0.5">{m.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-slate-100 font-semibold">Performance overview</h2>
              <p className="text-sm text-slate-500">Session volume, last 7 days</p>
            </div>
            <button
              onClick={() => onNavigate("analytics")}
              className="text-sm text-indigo-400 hover:text-indigo-300 inline-flex items-center gap-1 transition-colors shrink-0"
            >
              View analytics <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={SESSIONS_TREND}>
                <defs>
                  <linearGradient id="sessionsFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#6366f1" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="#6366f1" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="#1e293b" vertical={false} />
                <XAxis dataKey="day" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} width={40} />
                <Tooltip contentStyle={CHART_TOOLTIP_STYLE} />
                <Area type="monotone" dataKey="sessions" stroke="#818cf8" strokeWidth={2} fill="url(#sessionsFill)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
          <h2 className="text-slate-100 font-semibold mb-4">Activity feed</h2>
          <div className="space-y-4">
            {ACTIVITY_LOGS.slice(0, 5).map((log) => (
              <button key={log.id} onClick={() => onOpenLog(log)} className="w-full flex items-start gap-3 text-left group">
                <span className={`mt-0.5 w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${STATUS_DOT[log.status]}`}>
                  {statusIcon(log.status)}
                </span>
                <span className="min-w-0">
                  <p className="text-sm text-slate-200 group-hover:text-white truncate transition-colors">{log.action}</p>
                  <p className="text-xs text-slate-500">
                    {log.time} by {log.user}
                  </p>
                </span>
              </button>
            ))}
          </div>
          <button
            onClick={() => onNavigate("activity")}
            className="mt-4 w-full text-center text-sm text-indigo-400 hover:text-indigo-300 py-2 rounded-lg hover:bg-slate-800 transition-colors"
          >
            View all activity
          </button>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   Activity page
   ============================================================ */

function ActivityPage({ onOpenLog }) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");

  const types = useMemo(() => ["all", ...new Set(ACTIVITY_LOGS.map((l) => l.type))], []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return ACTIVITY_LOGS.filter((log) => {
      const matchesSearch = !q || log.action.toLowerCase().includes(q) || log.user.toLowerCase().includes(q);
      const matchesStatus = statusFilter === "all" || log.status === statusFilter;
      const matchesType = typeFilter === "all" || log.type === typeFilter;
      return matchesSearch && matchesStatus && matchesType;
    });
  }, [search, statusFilter, typeFilter]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-100">Activity</h1>
        <p className="text-slate-500 mt-1">Every authentication and account event across your workspace.</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search activity logs..."
            className="w-full bg-slate-900 border border-slate-800 rounded-lg pl-9 pr-3 py-2.5 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="bg-slate-900 border border-slate-800 rounded-lg px-3 py-2.5 text-sm text-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="all">All statuses</option>
          <option value="success">Success</option>
          <option value="failed">Failed</option>
          <option value="warning">Warning</option>
        </select>
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="bg-slate-900 border border-slate-800 rounded-lg px-3 py-2.5 text-sm text-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          {types.map((t) => (
            <option key={t} value={t}>
              {t === "all" ? "All types" : t}
            </option>
          ))}
        </select>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-800 text-left text-slate-500">
                <th className="px-5 py-3 font-medium">Event</th>
                <th className="px-5 py-3 font-medium">User</th>
                <th className="px-5 py-3 font-medium">Type</th>
                <th className="px-5 py-3 font-medium">Status</th>
                <th className="px-5 py-3 font-medium">Time</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((log) => (
                <tr
                  key={log.id}
                  onClick={() => onOpenLog(log)}
                  className="border-b border-slate-800 last:border-0 hover:bg-slate-800 cursor-pointer transition-colors"
                >
                  <td className="px-5 py-3.5 text-slate-200">{log.action}</td>
                  <td className="px-5 py-3.5 text-slate-400">{log.user}</td>
                  <td className="px-5 py-3.5 text-slate-400">{log.type}</td>
                  <td className="px-5 py-3.5">
                    <StatusBadge value={log.status} />
                  </td>
                  <td className="px-5 py-3.5 text-slate-500 whitespace-nowrap">{log.time}</td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-5 py-10 text-center text-slate-500">
                    No activity matches your filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   Settings page
   ============================================================ */

function SettingsPage() {
  const [twoFactor, setTwoFactor] = useState(true);
  const [loginAlerts, setLoginAlerts] = useState(true);
  const [emailNotifs, setEmailNotifs] = useState(true);
  const [productUpdates, setProductUpdates] = useState(false);
  const [sessionTimeout, setSessionTimeout] = useState("1h");
  const [defaultRole, setDefaultRole] = useState("Viewer");
  const [showCurrentPw, setShowCurrentPw] = useState(false);
  const [showNewPw, setShowNewPw] = useState(false);
  const [pwForm, setPwForm] = useState({ current: "", next: "", confirm: "" });
  const [pwSaved, setPwSaved] = useState(false);
  const [dangerOpen, setDangerOpen] = useState(false);

  const pwMismatch = pwForm.next && pwForm.confirm && pwForm.next !== pwForm.confirm;
  const canSubmitPw = pwForm.current && pwForm.next && pwForm.confirm && !pwMismatch;

  function handlePwSubmit(e) {
    e.preventDefault();
    if (!canSubmitPw) return;
    setPwSaved(true);
    setPwForm({ current: "", next: "", confirm: "" });
    setTimeout(() => setPwSaved(false), 3000);
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-semibold text-slate-100">Settings</h1>
        <p className="text-slate-500 mt-1">Manage your profile, security preferences and workspace defaults.</p>
      </div>

      <section className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
        <h2 className="text-slate-100 font-semibold mb-1">Profile</h2>
        <p className="text-sm text-slate-500 mb-5">This information is visible to other members of {WORKSPACE}.</p>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-slate-400 mb-1.5">Full name</label>
            <input
              defaultValue="Amelia Rhodes"
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2.5 text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm text-slate-400 mb-1.5">Email address</label>
            <input
              defaultValue="amelia@northfield.co"
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2.5 text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>
        <button className="mt-5 bg-slate-800 hover:bg-slate-700 text-slate-100 text-sm font-medium px-4 py-2.5 rounded-lg transition-colors">
          Save changes
        </button>
      </section>

      <section className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
        <h2 className="text-slate-100 font-semibold mb-1">Security</h2>
        <p className="text-sm text-slate-500">Control how your account can be accessed.</p>
        <div className="divide-y divide-slate-800">
          <Toggle
            label="Two-factor authentication"
            description="Require a verification code in addition to your password."
            checked={twoFactor}
            onChange={setTwoFactor}
          />
          <Toggle
            label="Login alerts"
            description="Get notified by email when a new device signs in."
            checked={loginAlerts}
            onChange={setLoginAlerts}
          />
          <div className="flex items-center justify-between gap-4 py-4">
            <div>
              <p className="text-sm font-medium text-slate-200">Session timeout</p>
              <p className="text-sm text-slate-500 mt-0.5">Automatically sign out after a period of inactivity.</p>
            </div>
            <select
              value={sessionTimeout}
              onChange={(e) => setSessionTimeout(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 shrink-0"
            >
              <option value="30m">30 minutes</option>
              <option value="1h">1 hour</option>
              <option value="4h">4 hours</option>
              <option value="never">Never</option>
            </select>
          </div>
          <div className="flex items-center justify-between gap-4 py-4">
            <div>
              <p className="text-sm font-medium text-slate-200">Default role for invites</p>
              <p className="text-sm text-slate-500 mt-0.5">New teammates receive this role unless changed.</p>
            </div>
            <select
              value={defaultRole}
              onChange={(e) => setDefaultRole(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 shrink-0"
            >
              <option>Viewer</option>
              <option>Editor</option>
              <option>Admin</option>
            </select>
          </div>
        </div>
      </section>

      <section className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
        <h2 className="text-slate-100 font-semibold mb-1">Notifications</h2>
        <p className="text-sm text-slate-500">Choose what {WORKSPACE} emails you about.</p>
        <div className="divide-y divide-slate-800">
          <Toggle
            label="Email notifications"
            description="Weekly summaries and important account activity."
            checked={emailNotifs}
            onChange={setEmailNotifs}
          />
          <Toggle
            label="Product updates"
            description="New features and changes to SecureAuth."
            checked={productUpdates}
            onChange={setProductUpdates}
          />
        </div>
      </section>

      <section className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
        <h2 className="text-slate-100 font-semibold mb-1">Change password</h2>
        <p className="text-sm text-slate-500 mb-5">Choose a strong password you don't use elsewhere.</p>
        <form onSubmit={handlePwSubmit} className="space-y-4 max-w-sm">
          <div>
            <label className="block text-sm text-slate-400 mb-1.5">Current password</label>
            <div className="relative">
              <input
                type={showCurrentPw ? "text" : "password"}
                value={pwForm.current}
                onChange={(e) => setPwForm((f) => ({ ...f, current: e.target.value }))}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2.5 pr-10 text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <button
                type="button"
                onClick={() => setShowCurrentPw((s) => !s)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
              >
                {showCurrentPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>
          <div>
            <label className="block text-sm text-slate-400 mb-1.5">New password</label>
            <div className="relative">
              <input
                type={showNewPw ? "text" : "password"}
                value={pwForm.next}
                onChange={(e) => setPwForm((f) => ({ ...f, next: e.target.value }))}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2.5 pr-10 text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <button
                type="button"
                onClick={() => setShowNewPw((s) => !s)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
              >
                {showNewPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>
          <div>
            <label className="block text-sm text-slate-400 mb-1.5">Confirm new password</label>
            <input
              type="password"
              value={pwForm.confirm}
              onChange={(e) => setPwForm((f) => ({ ...f, confirm: e.target.value }))}
              className={`w-full bg-slate-950 border rounded-lg px-3 py-2.5 text-sm text-slate-200 focus:outline-none focus:ring-2 ${
                pwMismatch ? "border-rose-700 focus:ring-rose-500" : "border-slate-800 focus:ring-indigo-500"
              }`}
            />
            {pwMismatch && <p className="text-xs text-rose-400 mt-1.5">Passwords don't match.</p>}
          </div>
          <div className="flex items-center gap-3 pt-1">
            <button
              type="submit"
              disabled={!canSubmitPw}
              className="bg-gradient-to-r from-indigo-500 to-violet-500 text-white text-sm font-medium px-4 py-2.5 rounded-lg hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed transition-opacity"
            >
              Update password
            </button>
            {pwSaved && (
              <span className="text-sm text-emerald-400 inline-flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" /> Password updated
              </span>
            )}
          </div>
        </form>
      </section>

      <section className="bg-slate-900 border border-rose-900 rounded-2xl p-6">
        <h2 className="text-slate-100 font-semibold mb-1">Danger zone</h2>
        <p className="text-sm text-slate-500 mb-4">Deactivating your account revokes all active sessions immediately.</p>
        <button
          onClick={() => setDangerOpen(true)}
          className="border border-rose-800 text-rose-400 hover:bg-rose-950 text-sm font-medium px-4 py-2.5 rounded-lg transition-colors"
        >
          Deactivate account
        </button>
      </section>

      <Modal open={dangerOpen} onClose={() => setDangerOpen(false)} title="Deactivate account">
        <p className="text-sm text-slate-400">
          This will immediately sign you out of every device and suspend your access to {WORKSPACE}. This action can be
          reversed by a workspace owner.
        </p>
        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={() => setDangerOpen(false)}
            className="px-4 py-2 rounded-lg text-sm font-medium text-slate-300 hover:bg-slate-800 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => setDangerOpen(false)}
            className="px-4 py-2 rounded-lg text-sm font-medium bg-rose-600 text-white hover:bg-rose-500 transition-colors"
          >
            Deactivate
          </button>
        </div>
      </Modal>
    </div>
  );
}

/* ============================================================
   Analytics page
   ============================================================ */

function AnalyticsPage() {
  const totalTraffic = TRAFFIC_SOURCES.reduce((s, t) => s + t.value, 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-100">Analytics</h1>
        <p className="text-slate-500 mt-1">Traffic, growth and conversion across the last 6 months.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-6">
          <h2 className="text-slate-100 font-semibold mb-1">Signup growth</h2>
          <p className="text-sm text-slate-500 mb-4">New workspace signups per month</p>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={GROWTH_DATA}>
                <CartesianGrid stroke="#1e293b" vertical={false} />
                <XAxis dataKey="month" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} width={40} />
                <Tooltip contentStyle={CHART_TOOLTIP_STYLE} />
                <Line type="monotone" dataKey="signups" stroke="#a78bfa" strokeWidth={2.5} dot={{ fill: "#a78bfa", r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
          <h2 className="text-slate-100 font-semibold mb-1">Traffic sources</h2>
          <p className="text-sm text-slate-500 mb-4">Share of visits, this month</p>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={TRAFFIC_SOURCES} dataKey="value" nameKey="source" innerRadius={45} outerRadius={70} paddingAngle={3}>
                  {TRAFFIC_SOURCES.map((entry, i) => (
                    <Cell key={entry.source} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={CHART_TOOLTIP_STYLE} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-2 mt-2">
            {TRAFFIC_SOURCES.map((t, i) => (
              <div key={t.source} className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-2 text-slate-400">
                  <span className="w-2 h-2 rounded-full shrink-0" style={{ background: PIE_COLORS[i % PIE_COLORS.length] }} />
                  {t.source}
                </span>
                <span className="text-slate-300 font-medium">{Math.round((t.value / totalTraffic) * 100)}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
        <h2 className="text-slate-100 font-semibold mb-1">Conversion funnel</h2>
        <p className="text-sm text-slate-500 mb-5">From first visit to an active account, last 30 days</p>
        <div className="space-y-4">
          {FUNNEL_DATA.map((f, i) => {
            const pct = Math.round((f.value / FUNNEL_DATA[0].value) * 100);
            const prev = i > 0 ? FUNNEL_DATA[i - 1].value : null;
            const dropoff = prev ? Math.round(((prev - f.value) / prev) * 100) : null;
            return (
              <div key={f.stage}>
                <div className="flex items-center justify-between text-sm mb-1.5 flex-wrap gap-x-3 gap-y-1">
                  <span className="text-slate-300 font-medium">{f.stage}</span>
                  <span className="text-slate-500">
                    {f.value.toLocaleString()} people, {pct}% of visitors
                    {dropoff !== null && <span className="text-rose-400 ml-2">-{dropoff}% drop-off</span>}
                  </span>
                </div>
                <div className="h-3 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-indigo-500 to-violet-500 rounded-full transition-all duration-500"
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   Users page
   ============================================================ */

function UsersPage({ onOpenUser }) {
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return USERS.filter((u) => {
      const matchesSearch = !q || u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q);
      const matchesRole = roleFilter === "all" || u.role === roleFilter;
      const matchesStatus = statusFilter === "all" || u.status === statusFilter;
      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [search, roleFilter, statusFilter]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-slate-100">Users</h1>
          <p className="text-slate-500 mt-1">{USERS.length} people have access to {WORKSPACE}.</p>
        </div>
        <button className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-500 to-violet-500 text-white text-sm font-medium px-4 py-2.5 rounded-lg hover:opacity-90 transition-opacity shrink-0">
          <UserPlus className="w-4 h-4" /> Invite user
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or email..."
            className="w-full bg-slate-900 border border-slate-800 rounded-lg pl-9 pr-3 py-2.5 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        </div>
        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="bg-slate-900 border border-slate-800 rounded-lg px-3 py-2.5 text-sm text-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="all">All roles</option>
          <option>Owner</option>
          <option>Admin</option>
          <option>Editor</option>
          <option>Viewer</option>
        </select>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="bg-slate-900 border border-slate-800 rounded-lg px-3 py-2.5 text-sm text-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="all">All statuses</option>
          <option>Active</option>
          <option>Invited</option>
          <option>Suspended</option>
        </select>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-800 text-left text-slate-500">
                <th className="px-5 py-3 font-medium">Name</th>
                <th className="px-5 py-3 font-medium">Role</th>
                <th className="px-5 py-3 font-medium">Status</th>
                <th className="px-5 py-3 font-medium">Last active</th>
                <th className="px-5 py-3 font-medium">Sessions</th>
                <th className="px-5 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((u) => (
                <tr
                  key={u.id}
                  onClick={() => onOpenUser(u)}
                  className="border-b border-slate-800 last:border-0 hover:bg-slate-800 cursor-pointer transition-colors"
                >
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <span className={`w-8 h-8 rounded-full ${u.color} flex items-center justify-center text-xs font-semibold text-white shrink-0`}>
                        {u.initials}
                      </span>
                      <span className="min-w-0">
                        <p className="text-slate-200 truncate">{u.name}</p>
                        <p className="text-xs text-slate-500 truncate">{u.email}</p>
                      </span>
                    </div>
                  </td>
                  <td className="px-5 py-3.5">
                    <RoleBadge role={u.role} />
                  </td>
                  <td className="px-5 py-3.5">
                    <StatusBadge value={u.status} />
                  </td>
                  <td className="px-5 py-3.5 text-slate-500 whitespace-nowrap">{u.lastActive}</td>
                  <td className="px-5 py-3.5 text-slate-500">{u.sessions}</td>
                  <td className="px-5 py-3.5 text-right">
                    <ChevronRight className="w-4 h-4 text-slate-600" />
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-5 py-10 text-center text-slate-500">
                    No users match your filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   Detail panels (slide-over + modal contents)
   ============================================================ */

function UserDetail({ user }) {
  const [role, setRole] = useState(user.role);
  const [status, setStatus] = useState(user.status);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <div className={`w-14 h-14 rounded-full ${user.color} flex items-center justify-center text-white font-semibold text-lg shrink-0`}>
          {user.initials}
        </div>
        <div className="min-w-0">
          <p className="text-slate-100 font-semibold truncate">{user.name}</p>
          <p className="text-sm text-slate-500 truncate">{user.email}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <p className="text-slate-500 mb-1">Joined</p>
          <p className="text-slate-200">{user.joined}</p>
        </div>
        <div>
          <p className="text-slate-500 mb-1">Last active</p>
          <p className="text-slate-200">{user.lastActive}</p>
        </div>
        <div>
          <p className="text-slate-500 mb-1">Active sessions</p>
          <p className="text-slate-200">{user.sessions}</p>
        </div>
        <div>
          <p className="text-slate-500 mb-1">Status</p>
          <StatusBadge value={status} />
        </div>
      </div>

      <div>
        <label className="block text-sm text-slate-400 mb-1.5">Role</label>
        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2.5 text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option>Owner</option>
          <option>Admin</option>
          <option>Editor</option>
          <option>Viewer</option>
        </select>
      </div>

      <div className="flex gap-3">
        {status === "Suspended" ? (
          <button
            onClick={() => setStatus("Active")}
            className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-medium px-4 py-2.5 rounded-lg transition-colors"
          >
            Reactivate user
          </button>
        ) : (
          <button
            onClick={() => setStatus("Suspended")}
            className="flex-1 border border-rose-800 text-rose-400 hover:bg-rose-950 text-sm font-medium px-4 py-2.5 rounded-lg transition-colors"
          >
            Suspend user
          </button>
        )}
        <button className="px-4 py-2.5 rounded-lg text-sm font-medium text-slate-300 hover:bg-slate-800 border border-slate-800 transition-colors">
          Resend invite
        </button>
      </div>
    </div>
  );
}

function LogDetail({ log }) {
  const rows = [
    { label: "User", value: log.user },
    { label: "Type", value: log.type },
    { label: "IP address", value: log.ip },
    { label: "Device", value: log.device },
    { label: "Location", value: log.location },
    { label: "Time", value: log.time },
  ];

  return (
    <div className="space-y-5">
      <div className="flex items-start gap-3">
        <span className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${STATUS_DOT[log.status]}`}>
          {statusIcon(log.status)}
        </span>
        <div>
          <p className="text-slate-100 font-medium">{log.action}</p>
          <div className="mt-1.5">
            <StatusBadge value={log.status} />
          </div>
        </div>
      </div>
      <div className="divide-y divide-slate-800 border-t border-slate-800">
        {rows.map((r) => (
          <div key={r.label} className="flex items-center justify-between py-2.5 text-sm">
            <span className="text-slate-500">{r.label}</span>
            <span className="text-slate-200">{r.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ============================================================
   App
   ============================================================ */

function initialsOfName(name = "") {
  return (
    name
      .split(" ")
      .filter(Boolean)
      .map((w) => w[0])
      .slice(0, 2)
      .join("")
      .toUpperCase() || "U"
  );
}

export default function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const currentUser = useMemo(
    () => ({
      name: user?.name || "Account",
      email: user?.email || "",
      initials: initialsOfName(user?.name),
    }),
    [user]
  );

  async function handleLogout() {
    await logout();
    navigate("/login", { replace: true });
  }

  const [activeTab, setActiveTab] = useState("dashboard");
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const [query, setQuery] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);

  const [notifOpen, setNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);

  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedLog, setSelectedLog] = useState(null);

  const searchRef = useRef(null);
  const notifRef = useRef(null);
  const userMenuRef = useRef(null);

  useEffect(() => {
    function handleClick(e) {
      if (searchRef.current && !searchRef.current.contains(e.target)) setSearchOpen(false);
      if (notifRef.current && !notifRef.current.contains(e.target)) setNotifOpen(false);
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) setUserMenuOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const searchResults = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return { users: [], logs: [] };
    return {
      users: USERS.filter((u) => u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q)).slice(0, 4),
      logs: ACTIVITY_LOGS.filter((l) => l.action.toLowerCase().includes(q) || l.user.toLowerCase().includes(q)).slice(0, 4),
    };
  }, [query]);

  const unreadCount = notifications.filter((n) => n.unread).length;

  function markAllRead() {
    setNotifications((ns) => ns.map((n) => ({ ...n, unread: false })));
  }

  function handleNavigate(id) {
    setActiveTab(id);
    setMobileSidebarOpen(false);
  }

  function openUserFromSearch(u) {
    setActiveTab("users");
    setSelectedUser(u);
    setQuery("");
    setSearchOpen(false);
  }

  function openLogFromSearch(l) {
    setActiveTab("activity");
    setSelectedLog(l);
    setQuery("");
    setSearchOpen(false);
  }

  return (
    <div className="min-h-screen bg-slate-950 flex">
      <Sidebar
        active={activeTab}
        onNavigate={handleNavigate}
        mobileOpen={mobileSidebarOpen}
        onCloseMobile={() => setMobileSidebarOpen(false)}
        currentUser={currentUser}
      />

      <div className="flex-1 flex flex-col min-w-0">
        <TopBar
          onOpenMobileSidebar={() => setMobileSidebarOpen(true)}
          query={query}
          setQuery={setQuery}
          searchOpen={searchOpen}
          setSearchOpen={setSearchOpen}
          searchResults={searchResults}
          searchRef={searchRef}
          onSelectUser={openUserFromSearch}
          onSelectLog={openLogFromSearch}
          notifOpen={notifOpen}
          setNotifOpen={setNotifOpen}
          notifRef={notifRef}
          notifications={notifications}
          unreadCount={unreadCount}
          onMarkAllRead={markAllRead}
          userMenuOpen={userMenuOpen}
          setUserMenuOpen={setUserMenuOpen}
          userMenuRef={userMenuRef}
          currentUser={currentUser}
          onLogout={handleLogout}
        />

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          {activeTab === "dashboard" && <DashboardPage onOpenLog={setSelectedLog} onNavigate={handleNavigate} />}
          {activeTab === "activity" && <ActivityPage onOpenLog={setSelectedLog} />}
          {activeTab === "settings" && <SettingsPage />}
          {activeTab === "analytics" && <AnalyticsPage />}
          {activeTab === "users" && <UsersPage onOpenUser={setSelectedUser} />}
        </main>
      </div>

      <SlideOver open={!!selectedUser} onClose={() => setSelectedUser(null)} title="User details">
        {selectedUser && <UserDetail user={selectedUser} />}
      </SlideOver>

      <Modal open={!!selectedLog} onClose={() => setSelectedLog(null)} title="Event details">
        {selectedLog && <LogDetail log={selectedLog} />}
      </Modal>
    </div>
  );
}

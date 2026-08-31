import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/auth/useAuth";
import { cn } from "@/lib/utils";
import {
    LayoutDashboard,
    Wrench,
    ClipboardList,
    Users,
    CalendarDays,
    ShieldAlert,
} from "lucide-react";

export default function Sidebar() {
    const { user } = useAuth();
    const location = useLocation();

    if (!user) return null;

    const navItems = {
        manager: [
            { icon: LayoutDashboard, label: "Dashboard", path: "/manager/dashboard" },
            { icon: Wrench, label: "Equipment", path: "/manager/equipment" },
            { icon: ClipboardList, label: "Requests", path: "/manager/requests" },
            { icon: Users, label: "Teams & Users", path: "/manager/teams" },
            { icon: CalendarDays, label: "Calendar", path: "/manager/calendar" },
        ],
        technician: [
            { icon: LayoutDashboard, label: "Dashboard", path: "/technician/dashboard" },
            { icon: ClipboardList, label: "My Requests", path: "/technician/requests" },
            { icon: CalendarDays, label: "Calendar", path: "/technician/calendar" },
        ],
        user: [
            { icon: LayoutDashboard, label: "Dashboard", path: "/user/dashboard" },
            { icon: ClipboardList, label: "My Requests", path: "/user/requests" },
        ]
    };

    const links = navItems[user.role] || [];

    return (
        <aside className="w-64 glass-sidebar text-sidebar-foreground h-full flex flex-col transition-all duration-300 relative z-40">
            <div className="h-16 flex items-center px-6 border-b border-sidebar-border/50 bg-sidebar/30">
                <Link to="/" className="text-2xl font-display font-extrabold flex items-center gap-2 premium-gradient-text drop-shadow-[0_0_10px_rgba(var(--primary),0.5)]">
                    <ShieldAlert size={28} className="text-primary" />
                    GearGuard
                </Link>
            </div>

            <nav className="flex-1 p-4 flex flex-col gap-1">
                {links.map((link) => {
                    const isActive = location.pathname.startsWith(link.path);
                    return (
                        <Link
                            key={link.path}
                            to={link.path}
                            className={cn(
                                "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                                isActive 
                                    ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-sm" 
                                    : "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground text-sidebar-foreground/80"
                            )}
                        >
                            <link.icon size={18} />
                            {link.label}
                        </Link>
                    );
                })}
            </nav>
        </aside>
    );
}

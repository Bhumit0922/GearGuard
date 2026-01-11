import { Link } from "react-router-dom";
import { useAuth } from "@/auth/useAuth";
import { Button } from "@/components/ui/button";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import NotificationDropdown from "@/components/notifications/NotificationDropdown";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";

import {
    LayoutDashboard,
    Wrench,
    ClipboardList,
    Users,
    CalendarDays
} from "lucide-react";

export default function Navbar() {
    const { user, logout } = useAuth();

    if (!user) return null;

    return (
        <header className="border-b">
            <div className="flex h-14 items-center justify-between px-6">

                {/* LEFT — App Name */}
                <Link to="/" className="text-lg font-semibold">
                    GearGuard
                </Link>

                {/* CENTER — Role-based navigation */}
                <nav className="flex items-center gap-6 text-sm">
                    {user.role === "manager" && (
                        <>
                            <Link className="flex items-center gap-1" to="/manager/dashboard">
                                <LayoutDashboard size={16} /> Dashboard
                            </Link>

                            <Link className="flex items-center gap-1" to="/manager/equipment">
                                <Wrench size={16} /> Equipment
                            </Link>

                            <Link className="flex items-center gap-1" to="/manager/requests">
                                <ClipboardList size={16} /> Requests
                            </Link>

                            <Link className="flex items-center gap-1" to="/manager/teams">
                                <Users size={16} /> Teams
                            </Link>

                            <Link className="flex items-center gap-1" to="/manager/calendar">
                                <CalendarDays size={16} /> Calendar
                            </Link>
                        </>
                    )}

                    {user.role === "technician" && (
                        <>
                            <Link className="flex items-center gap-1" to="/technician/dashboard">
                                <LayoutDashboard size={16} /> Dashboard
                            </Link>

                            <Link className="flex items-center gap-1" to="/technician/requests">
                                <ClipboardList size={16} /> My Requests
                            </Link>

                            <Link className="flex items-center gap-1" to="/technician/calendar">
                                <CalendarDays size={16} /> Calendar
                            </Link>
                        </>
                    )}

                    {user.role === "user" && (
                        <>
                            <Link className="flex items-center gap-1" to="/user/dashboard">
                                <LayoutDashboard size={16} /> Dashboard
                            </Link>

                            <Link className="flex items-center gap-1" to="/user/requests">
                                <ClipboardList size={16} /> My Requests
                            </Link>
                        </>
                    )}
                </nav>

                {/* RIGHT — User Dropdown */}
                {/* RIGHT — Notifications + User Dropdown */}
                <div className="flex items-center gap-2">
                    {/* 🔔 Notifications */}
                    <NotificationDropdown />

                    {/* 👤 User Menu */}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="p-0">
                                <Avatar className="h-8 w-8">
                                    <AvatarImage src="" />
                                    <AvatarFallback>
                                        {user.name?.[0]?.toUpperCase() || "U"}
                                    </AvatarFallback>
                                </Avatar>
                            </Button>
                        </DropdownMenuTrigger>

                        <DropdownMenuContent className="w-56" align="end">
                            <DropdownMenuLabel>My Account</DropdownMenuLabel>

                            <DropdownMenuGroup>
                                <DropdownMenuItem disabled>
                                    Role: {user.role}
                                </DropdownMenuItem>
                                <DropdownMenuItem disabled>
                                    Team: {user.team_id ?? "—"}
                                </DropdownMenuItem>
                            </DropdownMenuGroup>

                            <DropdownMenuSeparator />

                            <DropdownMenuGroup>
                                <DropdownMenuItem onClick={logout}>
                                    Log out
                                </DropdownMenuItem>
                            </DropdownMenuGroup>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>

            <Separator />
        </header>
    );
}

import { Link } from "react-router-dom"
import { useAuth } from "@/auth/useAuth"
import { Button } from "@/components/ui/button"

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"

export default function Navbar() {
    const { user, logout } = useAuth()

    if (!user) return null

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
                            <Link to="/manager/dashboard">Dashboard</Link>
                            <Link to="/manager/equipment">Equipment</Link>
                            <Link to="/manager/requests">Requests</Link>
                            <Link to="/manager/teams">Teams</Link>
                        </>
                    )}

                    {user.role === "technician" && (
                        <>
                            <Link to="/technician/dashboard">Dashboard</Link>
                            <Link to="/technician/requests">My Requests</Link>
                        </>
                    )}

                    {user.role === "user" && (
                        <>
                            <Link to="/user/dashboard">Dashboard</Link>
                            <Link to="/user/requests">My Requests</Link>
                        </>
                    )}
                </nav>

                {/* RIGHT — User Dropdown */}
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

            <Separator />
        </header>
    )
}

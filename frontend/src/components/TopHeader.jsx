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
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Link } from "react-router-dom";

export default function TopHeader() {
    const { user, logout } = useAuth();

    if (!user) return null;

    return (
        <header className="h-16 glass-header flex items-center justify-between px-6 lg:px-8 sticky top-0 z-30">
            <div className="flex-1" />

            <div className="flex items-center gap-4">
                <span className="hidden md:inline-flex px-2.5 py-1 text-xs font-semibold uppercase tracking-wider text-primary bg-primary/10 rounded-full border border-primary/20">
                    {user.role}
                </span>

                <NotificationDropdown />

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="relative h-9 w-9 rounded-full ring-2 ring-transparent transition-all hover:ring-primary/20 data-[state=open]:ring-primary/50">
                            <Avatar className="h-9 w-9">
                                <AvatarFallback className="bg-primary/10 text-primary font-medium">
                                    {user.name?.[0]?.toUpperCase() || "U"}
                                </AvatarFallback>
                            </Avatar>
                        </Button>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent className="w-56" align="end">
                        <DropdownMenuLabel className="font-normal">
                            <div className="flex flex-col space-y-1">
                                <p className="text-sm font-medium leading-none">{user.name}</p>
                                <p className="text-xs leading-none text-muted-foreground">{user.email || user.role}</p>
                            </div>
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuGroup>
                            <DropdownMenuItem disabled>
                                Role: <span className="ml-auto font-medium capitalize">{user.role}</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem disabled>
                                Team ID: <span className="ml-auto">{user.team_id ?? "N/A"}</span>
                            </DropdownMenuItem>
                        </DropdownMenuGroup>
                        
                        <DropdownMenuSeparator />
                        
                        <DropdownMenuItem asChild className="cursor-pointer">
                            <Link to={`/${user.role}/profile`}>
                                Profile Settings
                            </Link>
                        </DropdownMenuItem>

                        <DropdownMenuSeparator />

                        <DropdownMenuItem onClick={logout} className="text-destructive focus:text-destructive cursor-pointer">
                            Log out
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </header>
    );
}

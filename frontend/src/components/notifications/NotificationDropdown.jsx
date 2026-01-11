import { useEffect, useState } from "react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
    DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Bell } from "lucide-react";
import { fetchNotifications, markNotificationRead } from "@/api/notifications";
import { Badge } from "@/components/ui/badge";

export default function NotificationDropdown() {
    const [notifications, setNotifications] = useState([]);

    useEffect(() => {
        let mounted = true;

        const load = async () => {
            const data = await fetchNotifications();
            if (mounted) setNotifications(data);
        };

        load();

        return () => {
            mounted = false;
        };
    }, []);

    const unreadCount = notifications.filter((n) => !n.is_read).length;

    const handleRead = async (id) => {
        await markNotificationRead(id);
        const data = await fetchNotifications();
        setNotifications(data);
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative p-0">
                    <Bell className="h-5 w-5" />
                    {unreadCount > 0 && (
                        <span className="absolute -top-1 -right-1">
                            <Badge className="px-1 text-xs">{unreadCount}</Badge>
                        </span>
                    )}
                </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-80">
                {notifications.length === 0 ? (
                    <div className="p-3 text-sm text-muted-foreground">
                        No notifications
                    </div>
                ) : (
                    notifications.map((n) => (
                        <DropdownMenuItem
                            key={n.id}
                            onClick={() => handleRead(n.id)}
                            className={`flex flex-col items-start gap-1 ${!n.is_read ? "bg-muted" : ""
                                }`}
                        >
                            <span className="text-sm">{n.message}</span>
                            <span className="text-xs text-muted-foreground">
                                {new Date(n.created_at).toLocaleString()}
                            </span>
                        </DropdownMenuItem>
                    ))
                )}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

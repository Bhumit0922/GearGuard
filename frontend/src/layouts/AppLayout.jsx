import { Outlet } from "react-router-dom";
import Sidebar from "@/components/Sidebar";
import TopHeader from "@/components/TopHeader";

export default function AppLayout() {
    return (
        <div className="flex h-screen overflow-hidden bg-background">
            <Sidebar />
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                <TopHeader />
                <main className="flex-1 overflow-y-auto p-6 lg:p-8 relative z-0">
                    <div className="mx-auto max-w-7xl h-full">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
}

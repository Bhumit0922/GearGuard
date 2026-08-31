import { Outlet } from "react-router-dom";
import { ShieldAlert } from "lucide-react";

export default function AuthLayout() {
    return (
        <div className="min-h-screen w-full flex flex-col md:flex-row bg-background">
            {/* Left Side - Brand & Imagery */}
            <div className="relative hidden w-full flex-1 flex-col justify-between bg-zinc-950 p-12 text-white md:flex lg:w-1/2 xl:w-[60%] before:absolute before:inset-0 before:bg-gradient-to-br before:from-primary/30 before:to-accent/20 before:z-0 overflow-hidden">
                <div className="relative z-10 flex items-center gap-3 text-3xl font-display font-extrabold text-white drop-shadow-lg">
                    <ShieldAlert size={36} className="text-primary" />
                    GearGuard
                </div>
                
                <div className="relative z-10 max-w-xl pb-10">
                    <h1 className="text-4xl lg:text-5xl font-display font-bold leading-tight tracking-tight mb-6 text-white drop-shadow-md">
                        Master Your Maintenance Operations.
                    </h1>
                    <p className="text-lg text-zinc-300 leading-relaxed font-light max-w-md">
                        Elevate your equipment lifecycle with smart insights, kanban boards, and robust team tracking. Welcome to the future of asset management.
                    </p>
                </div>
                {/* Abstract animated background shapes */}
                <div className="absolute top-[20%] right-[10%] w-[500px] h-[500px] bg-primary/40 rounded-full mix-blend-screen filter blur-[100px] opacity-70 animate-pulse"></div>
                <div className="absolute bottom-[10%] left-[10%] w-[400px] h-[400px] bg-accent/40 rounded-full mix-blend-screen filter blur-[80px] opacity-70 animate-pulse" style={{ animationDelay: '2s' }}></div>
            </div>
            
            {/* Right Side - Form Container */}
            <div className="flex w-full items-center justify-center p-6 md:p-12 lg:w-1/2 xl:w-[40%] bg-transparent relative z-10">
                <div className="absolute inset-0 bg-background/60 backdrop-blur-3xl md:bg-background/80 shadow-[-20px_0_50px_rgba(0,0,0,0.1)] border-l border-white/5 dark:border-white/5"></div>
                <div className="relative w-full max-w-md z-20">
                    <Outlet />
                </div>
            </div>
        </div>
    );
}

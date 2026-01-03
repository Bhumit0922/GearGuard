import { Navigate } from "react-router-dom";
import { useAuth } from "@/auth/useAuth";

export default function ProtectedRoute({ children, allowedRoles }) {
    const { user, loading } = useAuth();

    // 🔒 BLOCK routing until auth bootstrap finishes
    if (loading) {
        return <div className="p-6 text-muted-foreground">Checking session...</div>;
    }

    // ❌ Only redirect AFTER loading is false
    if (!user) {
        return <Navigate to="/login" replace />;
    }

    if (allowedRoles && !allowedRoles.includes(user.role)) {
        return <Navigate to="/login" replace />;
    }

    return children;
}

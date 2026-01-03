import { useState } from "react";
import { useAuth } from "@/auth/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { useNavigate, Link } from "react-router-dom";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const user = await login(email, password);

      if (user.role === "manager") navigate("/manager/dashboard");
      else if (user.role === "technician") navigate("/technician/dashboard");
      else navigate("/user/dashboard");
    } catch (err) {
      setError(err?.response?.data?.message || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-[360px] p-6 space-y-6 shadow-md">
      {/* Header */}
      <div className="text-center space-y-1">
        <h1 className="text-2xl font-bold">GearGuard</h1>
        <p className="text-sm text-muted-foreground">
          Equipment Maintenance System
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label>Email</Label>
          <Input
            disabled={loading}
            type="email"
            placeholder="you@company.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="relative">
          <Label>Password</Label>

          <Input
            disabled={loading}
            type={showPassword ? "text" : "password"}
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onBlur={() => setShowPassword(false)}   // 👈 auto-hide on blur
          />

          <button
            type="button"
            onClick={() => setShowPassword(true)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground hover:text-foreground"
          >
            Show
          </button>
        </div>

        {error && (
          <p className="text-sm text-red-600">{error}</p>
        )}
        
        <Button className="w-full" disabled={loading}>
          {loading ? "Signing in..." : "Login"}
        </Button>
      </form>

      {/* Footer */}
      <p className="text-center text-sm text-muted-foreground">
        Don’t have an account?{" "}
        <Link to="/signup" className="text-primary hover:underline">
          Sign up
        </Link>
      </p>
    </Card>
  );
}

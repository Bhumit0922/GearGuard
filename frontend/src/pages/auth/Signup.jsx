import { useState } from "react";
import api from "@/api/axios";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { ShieldAlert, User, Mail, Lock, EyeOff, Eye, Loader2 } from "lucide-react";

export default function Signup() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (password !== confirm) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      await api.post("/users/signup", { name, email, password });

      // auto login
      const loginRes = await api.post("/users/login", { email, password });
      const { accessToken, refreshToken, user } = loginRes.data.data;

      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);

      // redirect by role
      if (user.role === "manager") navigate("/manager/dashboard");
      else if (user.role === "technician") navigate("/technician/dashboard");
      else navigate("/user/dashboard");

    } catch (err) {
      setError(err?.response?.data?.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="glass-card rounded-2xl p-8 space-y-6 animate-in fade-in zoom-in-95 duration-500 relative z-20 overflow-hidden">
        
        <div className="flex flex-col items-center space-y-3 text-center">
          <div className="h-12 w-12 bg-primary/10 rounded-xl flex items-center justify-center border border-primary/20 mb-2">
            <ShieldAlert className="h-7 w-7 text-primary" />
          </div>
          <h1 className="text-3xl font-display font-bold tracking-tight text-card-foreground">
            Create Account
          </h1>
          <p className="text-sm text-muted-foreground">
            Join GearGuard and master your operations
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2 relative">
            <Label>Full Name</Label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User className="h-4 w-4 text-muted-foreground" />
              </div>
              <Input 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
                placeholder="John Doe"
                className="pl-10 h-11 bg-background/50 focus:bg-background transition-colors"
                required 
              />
            </div>
          </div>

          <div className="space-y-2 relative">
            <Label>Email</Label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-4 w-4 text-muted-foreground" />
              </div>
              <Input 
                type="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                placeholder="you@company.com"
                className="pl-10 h-11 bg-background/50 focus:bg-background transition-colors"
                required 
              />
            </div>
          </div>

          <div className="space-y-2 relative">
            <Label>Password</Label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-4 w-4 text-muted-foreground" />
              </div>
              <Input
                type={showPassword ? "text" : "password"}
                value={password}
                placeholder="••••••••"
                onChange={(e) => setPassword(e.target.value)}
                className="pl-10 pr-10 h-11 bg-background/50 focus:bg-background transition-colors"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-muted-foreground hover:text-foreground transition-colors outline-none"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <div className="space-y-2 relative">
            <Label>Confirm Password</Label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-4 w-4 text-muted-foreground" />
              </div>
              <Input
                type={showConfirm ? "text" : "password"}
                value={confirm}
                placeholder="••••••••"
                onChange={(e) => setConfirm(e.target.value)}
                className="pl-10 pr-10 h-11 bg-background/50 focus:bg-background transition-colors"
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-muted-foreground hover:text-foreground transition-colors outline-none"
              >
                {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {error && (
            <div className="p-3 rounded-md bg-destructive/10 border border-destructive/20 text-destructive text-sm flex items-start gap-2">
               <ShieldAlert className="h-4 w-4 mt-0.5 shrink-0" />
               <p>{error}</p>
            </div>
          )}

          <Button className="w-full h-11 font-medium text-[15px]" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating account...
              </>
            ) : "Sign Up"}
          </Button>
        </form>

        <div className="pt-2 text-center text-sm text-muted-foreground border-t border-border/50">
          <p className="mt-4">
            Already have an account?{" "}
            <Link to="/login" className="text-primary font-medium hover:underline underline-offset-4 transition-all">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

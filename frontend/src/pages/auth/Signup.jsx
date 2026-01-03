import { useState } from "react";
import api from "@/api/axios";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";

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
    <Card className="w-[360px] p-6 space-y-6 shadow-md">
      <div className="text-center space-y-1">
        <h1 className="text-2xl font-bold">Create Account</h1>
        <p className="text-sm text-muted-foreground">
          Join GearGuard
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label>Name</Label>
          <Input value={name} onChange={(e) => setName(e.target.value)} required />
        </div>

        <div>
          <Label>Email</Label>
          <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>

        {/* Password */}
        <div className="relative">
          <Label>Password</Label>

          <Input
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onBlur={() => setShowPassword(false)}
            required
          />

          <button
            type="button"
            onClick={() => setShowPassword(true)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground hover:text-foreground"
          >
            Show
          </button>

          <p className="text-xs text-muted-foreground mt-1">
            At least 8 chars, uppercase, lowercase & symbol
          </p>
        </div>

        {/* Confirm Password */}
        <div className="relative">
          <Label>Confirm Password</Label>

          <Input
            type={showConfirm ? "text" : "password"}
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            onBlur={() => setShowConfirm(false)}
            required
          />

          <button
            type="button"
            onClick={() => setShowConfirm(true)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground hover:text-foreground"
          >
            Show
          </button>
        </div>


        {error && <p className="text-sm text-red-600">{error}</p>}

        <Button className="w-full" disabled={loading}>
          {loading ? "Creating account..." : "Sign up"}
        </Button>
      </form>

      <p className="text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link to="/login" className="text-primary hover:underline">
          Login
        </Link>
      </p>
    </Card>
  );
}

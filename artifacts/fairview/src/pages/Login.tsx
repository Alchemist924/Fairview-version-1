import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLoginUser, useRegisterUser } from "@workspace/api-client-react";
import { useAuth } from "@/hooks/use-auth";
import { toast } from "@/hooks/use-toast";
import { Home, Loader2 } from "lucide-react";

export default function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [, setLocation] = useLocation();
  const { user } = useAuth();

  // If already logged in, redirect
  if (user) {
    setLocation("/");
    return null;
  }

  const loginMutation = useLoginUser({
    mutation: {
      onSuccess: () => {
        toast({ title: "Welcome back!" });
        // The auth context will pick up the user on next query invalidate,
        // but we trigger navigation. A real app might await the invalidation.
        setTimeout(() => setLocation("/"), 100);
      },
      onError: (error) => {
        toast({ title: "Login failed", description: error.error?.error || "Check credentials", variant: "destructive" });
      }
    }
  });

  const registerMutation = useRegisterUser({
    mutation: {
      onSuccess: () => {
        toast({ title: "Account created! You are now logged in." });
        setTimeout(() => setLocation("/"), 100);
      },
      onError: (error) => {
        toast({ title: "Registration failed", description: error.error?.error || "Try a different username", variant: "destructive" });
      }
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) return;

    if (isLogin) {
      loginMutation.mutate({ data: { username, password } });
    } else {
      registerMutation.mutate({ data: { username, password } });
    }
  };

  const isPending = loginMutation.isPending || registerMutation.isPending;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 relative">
      <Link href="/" className="absolute top-8 left-8 flex items-center text-gray-500 hover:text-primary transition-colors">
        <Home className="w-5 h-5 mr-2" /> Back to Home
      </Link>

      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-3xl shadow-xl border border-gray-100">
        <div className="text-center">
           <img 
            src={`${import.meta.env.BASE_URL}images/logo.png`} 
            alt="Fairview Logo" 
            className="h-16 w-16 mx-auto object-contain mb-4" 
          />
          <h2 className="text-3xl font-display font-bold text-primary">
            {isLogin ? "Sign in to Fairview" : "Create an Account"}
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            {isLogin ? "Or " : "Already have an account? "}
            <button 
              onClick={() => setIsLogin(!isLogin)} 
              className="font-medium text-accent hover:text-accent/80"
            >
              {isLogin ? "register a new account" : "sign in here"}
            </button>
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                name="username"
                type="text"
                required
                className="mt-1 block w-full rounded-xl bg-gray-50 h-12"
                placeholder="Choose a username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                required
                className="mt-1 block w-full rounded-xl bg-gray-50 h-12"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <Button 
            type="submit" 
            className="w-full h-12 text-lg rounded-xl bg-primary hover:bg-primary/90 text-white shadow-lg"
            disabled={isPending}
          >
            {isPending && <Loader2 className="w-5 h-5 mr-2 animate-spin" />}
            {isLogin ? "Sign In" : "Register"}
          </Button>
        </form>
      </div>
    </div>
  );
}

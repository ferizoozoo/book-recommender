import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";

interface SignupData {
  email: string;
  password: string;
  retypePassword: string | null;
}

interface SignupFormProps extends React.ComponentProps<"div"> {
  className?: string;
  handleregister: (submitData: SignupData) => Promise<void>;
}

const SignupForm = ({ className, ...props }: SignupFormProps) => {
  const { handleregister } = props;

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [retypePassword, setRetypePassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
  };

  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  };

  const handleRetypePasswordChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRetypePassword(event.target.value);
  };

  const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (password !== retypePassword) {
      setError("Passwords do not match");
      return;
    }
    setError(null);
    await handleregister({ email, password, retypePassword });
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="bg-slate-800 border-slate-700 text-amber-50">
        <CardHeader>
          <CardTitle>Create your account</CardTitle>
          <CardDescription>
            Enter your email below to create a new account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSignup}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-3">
                <Label htmlFor="email">Email</Label>
                <Input
                  className="text-amber-50"
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                  value={email}
                  onChange={handleEmailChange}
                />
              </div>
              <div className="grid gap-3">
                <Label htmlFor="email">Password</Label>
                <Input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={handlePasswordChange}
                />
              </div>
              <div className="grid gap-3">
                <Label htmlFor="retype-password">Retype Password</Label>
                <Input
                  id="retype-password"
                  type="password"
                  required
                  value={retypePassword}
                  onChange={handleRetypePasswordChange}
                />
              </div>
              {error && <div className="text-red-500 text-sm">{error}</div>}
              <div className="flex flex-col gap-3">
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Creating account..." : "Create Account"}
                </Button>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default SignupForm;

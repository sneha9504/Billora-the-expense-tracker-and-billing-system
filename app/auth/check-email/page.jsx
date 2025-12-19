import Link from "next/link";
import { Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function CheckEmailPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-primary/10 p-4">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
            <Mail className="h-8 w-8" />
          </div>
          <CardTitle className="text-2xl">Check your email</CardTitle>
          <CardDescription>
            {"We've sent you a confirmation link. Please check your email to verify your account."}
          </CardDescription>
        </CardHeader>

        <CardContent>
          <p className="text-sm text-muted-foreground">
            {"Didn't receive the email? Check your spam folder or try signing up again."}
          </p>
        </CardContent>

        <CardFooter className="flex flex-col gap-4">
          <Link href="/auth/login" className="w-full">
            <Button variant="outline" className="w-full bg-transparent">
              Back to Sign In
            </Button>
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}

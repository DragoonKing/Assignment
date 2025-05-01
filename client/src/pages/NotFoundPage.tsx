import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";
import { Link } from "wouter";

export default function NotFoundPage() {
  return (
    <div className="min-h-[calc(100vh-200px)] w-full flex items-center justify-center bg-apollo-gray-50">
      <Card className="w-full max-w-md mx-4">
        <CardContent className="pt-6">
          <div className="flex mb-4 gap-2">
            <AlertCircle className="h-8 w-8 text-red-500" />
            <h1 className="text-2xl font-bold text-apollo-gray-900">404 Page Not Found</h1>
          </div>

          <p className="mt-4 text-sm text-apollo-gray-600 mb-6">
            The page you are looking for doesn't exist or has been moved.
          </p>
          
          <div className="flex justify-end">
            <Link href="/">
              <Button>
                Go to Home
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

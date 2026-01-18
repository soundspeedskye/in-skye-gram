import type { ReactNode } from "react";
import { useAuth } from "@/app/providers/AuthProvider";

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    // AuthProvider에서 이미 리다이렉트 처리를 하고 있으므로 여기서는 null 반환
    return null;
  }

  return <>{children}</>;
};

export default ProtectedRoute;

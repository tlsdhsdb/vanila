"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { fetchCurrentAccount } from "@/features/auth/auth-api";
import { clearAuthToken, getAuthToken } from "@/features/auth/auth-storage";
import { getApiErrorMessage, isAuthenticationError } from "@/lib/api-client";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const router = useRouter();
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function verifyToken() {
      const token = getAuthToken();

      if (!token) {
        router.replace("/login");
        return;
      }

      try {
        await fetchCurrentAccount(token);

        if (isMounted) {
          setIsReady(true);
        }
      } catch (caughtError) {
        if (isAuthenticationError(caughtError)) {
          clearAuthToken();
          router.replace("/login");
          return;
        }

        if (isMounted) {
          setError(getApiErrorMessage(caughtError));
        }
      }
    }

    verifyToken();

    return () => {
      isMounted = false;
    };
  }, [router]);

  if (!isReady) {
    return (
      <main className="auth-page">
        <section className="panel auth-card">
          <p className="eyebrow">Auth check</p>
          <h1>Checking session</h1>
          <p className="lead">{error ?? "로그인 상태를 확인하는 중입니다."}</p>
        </section>
      </main>
    );
  }

  return <>{children}</>;
}

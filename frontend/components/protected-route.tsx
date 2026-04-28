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
          <p className="eyebrow">인증 확인</p>
          <h1>세션 확인 중</h1>
          <p className="lead">{error ?? "현재 로그인 세션을 확인하고 있습니다."}</p>
        </section>
      </main>
    );
  }

  return <>{children}</>;
}

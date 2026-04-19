"use client";

import { useEffect, useState } from "react";

import { apiClient } from "@/lib/api-client";
import type { ApiEnvelope, HealthCheckResponse } from "@/types/api";

export function useApiHealth() {
  const [data, setData] = useState<HealthCheckResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function loadHealth() {
      try {
        const response = await apiClient.get<ApiEnvelope<HealthCheckResponse>>("/api/health");

        if (!isMounted) {
          return;
        }

        setData(response.data);
      } catch (caughtError) {
        if (!isMounted) {
          return;
        }

        const message = caughtError instanceof Error ? caughtError.message : "Unknown error";
        setError(message);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadHealth();

    return () => {
      isMounted = false;
    };
  }, []);

  return {
    data,
    error,
    isLoading,
  };
}


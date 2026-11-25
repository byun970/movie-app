import { useCallback, useEffect, useState } from "react";
import { fetchJson, getErrorMessage } from "../api";

interface FetchState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  retry: () => void;
}

export const useFetch = <T>(path: string): FetchState<T> => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError(null);
    setData(null);
    fetchJson<T>(path, controller.signal)
      .then((result) => {
        setData(result);
        setLoading(false);
      })
      .catch((e) => {
        if (controller.signal.aborted) return;
        setError(getErrorMessage(e));
        setLoading(false);
      });
    return () => controller.abort();
  }, [path, attempt]);

  const retry = useCallback(() => setAttempt((n) => n + 1), []);

  return { data, loading, error, retry };
};

export const API_BASE = "https://movies-api.accel.li/api/v2";

export class ApiError extends Error {}

export const fetchJson = async <T>(
  path: string,
  signal?: AbortSignal
): Promise<T> => {
  const res = await fetch(`${API_BASE}${path}`, { signal });
  if (!res.ok) {
    throw new ApiError(`서버 응답 오류 (${res.status})`);
  }
  const json = await res.json();
  if (json.status !== "ok") {
    throw new ApiError(json.status_message || "요청에 실패했습니다.");
  }
  return json.data as T;
};

export const getErrorMessage = (e: unknown) =>
  e instanceof ApiError
    ? e.message
    : "네트워크 연결을 확인하고 다시 시도해 주세요.";

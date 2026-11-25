import { ApiError, fetchJson, getErrorMessage } from "./api";
import { apiOk, mockFetch } from "./testUtils";

describe("fetchJson", () => {
  it("성공하면 data만 돌려준다", async () => {
    mockFetch(() => ({ body: apiOk({ movies: [] }) }));
    await expect(fetchJson("/list_movies.json")).resolves.toEqual({
      movies: [],
    });
  });

  it("API 기본 주소를 앞에 붙여 요청한다", async () => {
    const fn = mockFetch(() => ({ body: apiOk({}) }));
    await fetchJson("/list_movies.json?page=2");
    expect(String(fn.mock.calls[0][0])).toBe(
      "https://movies-api.accel.li/api/v2/list_movies.json?page=2"
    );
  });

  it("HTTP 오류면 상태 코드가 담긴 ApiError를 던진다", async () => {
    mockFetch(() => ({ ok: false, status: 503 }));
    await expect(fetchJson("/x")).rejects.toThrow("서버 응답 오류 (503)");
  });

  it("status가 ok가 아니면 API 메시지로 ApiError를 던진다", async () => {
    mockFetch(() => ({
      body: { status: "error", status_message: "잘못된 요청" },
    }));
    await expect(fetchJson("/x")).rejects.toThrow(ApiError);
    await expect(fetchJson("/x")).rejects.toThrow("잘못된 요청");
  });
});

describe("getErrorMessage", () => {
  it("ApiError는 메시지를 그대로 쓴다", () => {
    expect(getErrorMessage(new ApiError("서버 응답 오류 (500)"))).toBe(
      "서버 응답 오류 (500)"
    );
  });

  it("그 외 오류는 네트워크 안내 문구를 쓴다", () => {
    expect(getErrorMessage(new TypeError("Failed to fetch"))).toContain(
      "네트워크"
    );
  });
});

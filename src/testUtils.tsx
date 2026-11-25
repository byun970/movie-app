import React from "react";
import { act, render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router-dom";

export const apiOk = (data: unknown) => ({ status: "ok", data });

interface MockResponse {
  ok?: boolean;
  status?: number;
  body?: unknown;
}

type Handler = (url: string) => MockResponse | Promise<MockResponse>;

// fetch를 가짜로 바꾼다. handler가 URL별로 응답을 정한다.
export const mockFetch = (handler: Handler) => {
  const fn = jest.fn(async (input: RequestInfo | URL) => {
    const res = await handler(String(input));
    return {
      ok: res.ok ?? true,
      status: res.status ?? 200,
      json: async () => res.body,
    } as Response;
  });
  global.fetch = fn as unknown as typeof fetch;
  return fn;
};

export const fetchedUrls = (fn: jest.Mock) =>
  fn.mock.calls.map((call) => String(call[0]));

export const makeMovie = (id: number, title = `Movie ${id}`) => ({
  id,
  title,
  medium_cover_image: `https://img.test/${id}.jpg`,
  genres: ["Action"],
});

export const renderWithRouter = (
  ui: React.ReactElement,
  { route = "/", path = "/" }: { route?: string; path?: string } = {}
) =>
  render(
    <MemoryRouter initialEntries={[route]}>
      <Routes>
        <Route path={path} element={ui} />
        <Route path="*" element={<div>other page</div>} />
      </Routes>
    </MemoryRouter>
  );

// user-event는 React의 act 밖에서 이벤트를 보내므로 act로 감싸서 쓴다
export const user = {
  click: (el: Element) => act(() => userEvent.click(el)),
  type: async (el: Element, text: string) => {
    await act(async () => {
      userEvent.type(el, text);
    });
  },
};

// 이미 끝난 요청의 상태 갱신이 테스트 밖으로 새지 않도록 마저 처리한다
export const settle = () => act(async () => {});

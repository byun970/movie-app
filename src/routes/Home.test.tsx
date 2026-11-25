import React from "react";
import { act, screen, waitFor } from "@testing-library/react";
import Home from "./Home";
import {
  apiOk,
  fetchedUrls,
  makeMovie,
  mockFetch,
  renderWithRouter,
  settle,
  user,
} from "../testUtils";

describe("Home", () => {
  afterEach(settle);


  it("로딩 후 영화 목록을 보여준다", async () => {
    mockFetch(() => ({
      body: apiOk({ movie_count: 2, movies: [makeMovie(1, "Heat"), makeMovie(2, "Alien")] }),
    }));
    renderWithRouter(<Home />);

    expect(screen.getByText("Loading...")).toBeInTheDocument();
    expect(await screen.findByRole("link", { name: "Heat" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Alien" })).toBeInTheDocument();
    expect(screen.queryByText("Loading...")).not.toBeInTheDocument();
  });

  it("결과가 없으면 안내 문구를 보여준다", async () => {
    // 결과 0건이면 API가 movies 키 자체를 생략한다
    mockFetch(() => ({ body: apiOk({ movie_count: 0 }) }));
    renderWithRouter(<Home />);

    expect(
      await screen.findByText("조건에 맞는 영화가 없어요.")
    ).toBeInTheDocument();
  });

  it("실패하면 에러 화면을 보여주고 다시 시도하면 복구된다", async () => {
    let calls = 0;
    mockFetch(() => {
      calls += 1;
      if (calls === 1) throw new TypeError("Failed to fetch");
      return { body: apiOk({ movie_count: 1, movies: [makeMovie(1, "Heat")] }) };
    });
    renderWithRouter(<Home />);

    expect(
      await screen.findByText("영화 목록을 불러오지 못했어요")
    ).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "다시 시도" }));
    expect(await screen.findByRole("link", { name: "Heat" })).toBeInTheDocument();
  });

  it("URL의 검색어, 장르, 정렬을 API 요청에 반영한다", async () => {
    const fn = mockFetch(() => ({ body: apiOk({ movie_count: 0 }) }));
    renderWithRouter(<Home />, { route: "/?q=batman&genre=Action&sort=year" });

    await screen.findByText("조건에 맞는 영화가 없어요.");
    const url = new URL(fetchedUrls(fn)[0]);
    expect(url.searchParams.get("query_term")).toBe("batman");
    expect(url.searchParams.get("genre")).toBe("Action");
    expect(url.searchParams.get("sort_by")).toBe("year");
    expect(url.searchParams.get("page")).toBe("1");
  });

  it("잘못된 정렬 값은 기본 정렬(평점순)로 처리한다", async () => {
    const fn = mockFetch(() => ({ body: apiOk({ movie_count: 0 }) }));
    renderWithRouter(<Home />, { route: "/?sort=bogus" });

    await screen.findByText("조건에 맞는 영화가 없어요.");
    expect(new URL(fetchedUrls(fn)[0]).searchParams.get("sort_by")).toBe("rating");
  });

  it("장르 칩을 누르면 해당 장르로 다시 불러오고, 다시 누르면 해제된다", async () => {
    const fn = mockFetch(() => ({ body: apiOk({ movie_count: 0 }) }));
    renderWithRouter(<Home />);
    await screen.findByText("조건에 맞는 영화가 없어요.");

    await user.click(screen.getByRole("button", { name: "Comedy" }));
    await waitFor(() =>
      expect(
        new URL(fetchedUrls(fn).slice(-1)[0]).searchParams.get("genre")
      ).toBe("Comedy")
    );

    await user.click(screen.getByRole("button", { name: "Comedy" }));
    await waitFor(() =>
      expect(new URL(fetchedUrls(fn).slice(-1)[0]).searchParams.has("genre")).toBe(false)
    );
  });

  it("검색어를 입력하면 잠시 뒤 검색 요청을 보낸다", async () => {
    const fn = mockFetch(() => ({ body: apiOk({ movie_count: 0 }) }));
    renderWithRouter(<Home />);
    await screen.findByText("조건에 맞는 영화가 없어요.");
    expect(fn).toHaveBeenCalledTimes(1);

    await user.type(screen.getByRole("searchbox", { name: "영화 검색" }), "alien");
    await waitFor(() =>
      expect(
        new URL(fetchedUrls(fn).slice(-1)[0]).searchParams.get("query_term")
      ).toBe("alien")
    );
    await screen.findByText("조건에 맞는 영화가 없어요.");
    // 글자마다 요청하지 않고 입력이 멈춘 뒤 한 번만 보낸다
    expect(fn).toHaveBeenCalledTimes(2);
  });

  describe("무한 스크롤", () => {
    let reach: (() => void) | undefined;

    beforeEach(() => {
      reach = undefined;
      (window as any).IntersectionObserver = class {
        constructor(cb: (entries: { isIntersecting: boolean }[]) => void) {
          reach = () => cb([{ isIntersecting: true }]);
        }
        observe() {}
        unobserve() {}
        disconnect() {}
      };
    });

    it("끝에 닿으면 다음 페이지를 불러와 이어 붙인다", async () => {
      const fn = mockFetch((url) => {
        const page = new URL(url).searchParams.get("page");
        return {
          body: apiOk({
            movie_count: 2,
            movies: [page === "1" ? makeMovie(1, "Heat") : makeMovie(2, "Alien")],
          }),
        };
      });
      renderWithRouter(<Home />);
      await screen.findByRole("link", { name: "Heat" });

      act(() => reach?.());

      expect(await screen.findByRole("link", { name: "Alien" })).toBeInTheDocument();
      expect(screen.getByRole("link", { name: "Heat" })).toBeInTheDocument();
      expect(new URL(fetchedUrls(fn).slice(-1)[0]).searchParams.get("page")).toBe("2");
    });

    it("전부 불러왔으면 더 요청하지 않는다", async () => {
      const fn = mockFetch(() => ({
        body: apiOk({ movie_count: 1, movies: [makeMovie(1, "Heat")] }),
      }));
      renderWithRouter(<Home />);
      await screen.findByRole("link", { name: "Heat" });

      expect(reach).toBeUndefined();
      expect(fn).toHaveBeenCalledTimes(1);
    });

    it("겹치는 영화는 중복해서 보여주지 않는다", async () => {
      mockFetch(() => ({
        body: apiOk({ movie_count: 3, movies: [makeMovie(1, "Heat"), makeMovie(2, "Alien")] }),
      }));
      renderWithRouter(<Home />);
      await screen.findByRole("link", { name: "Heat" });

      act(() => reach?.());

      // 다음 페이지 응답까지 반영된 뒤에 확인한다
      await waitFor(() =>
        expect(screen.queryByText("불러오는 중...")).not.toBeInTheDocument()
      );
      expect(screen.getAllByRole("link", { name: "Heat" })).toHaveLength(1);
      expect(screen.getAllByRole("link", { name: "Alien" })).toHaveLength(1);
    });
  });
});

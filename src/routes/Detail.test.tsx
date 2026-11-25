import React from "react";
import { screen } from "@testing-library/react";
import Detail from "./Detail";
import {
  apiOk,
  makeMovie,
  mockFetch,
  renderWithRouter,
  settle,
  user,
} from "../testUtils";

const fullMovie = {
  ...makeMovie(7, "Heat"),
  year: 1995,
  runtime: 170,
  description_full: "A group of professional bank robbers.",
  rating: 8.3,
  like_count: 1234,
  mpa_rating: "R",
  yt_trailer_code: "abc123",
  genres: ["Action", "Crime"],
  cast: [{ name: "Al Pacino", character_name: "Vincent", imdb_code: "1" }],
};

const renderDetail = (id = "7") =>
  renderWithRouter(<Detail />, { route: `/movie/${id}`, path: "/movie/:id" });

// 상세와 비슷한 영화 요청을 URL로 구분해 응답한다
const mockDetailApi = (detail: unknown, suggestions: unknown[] = []) =>
  mockFetch((url) =>
    url.includes("movie_suggestions")
      ? { body: apiOk({ movies: suggestions }) }
      : { body: apiOk({ movie: detail }) }
  );

describe("Detail", () => {
  afterEach(settle);


  it("영화 정보를 보여준다", async () => {
    mockDetailApi(fullMovie);
    renderDetail();

    expect(screen.getByText("Loading...")).toBeInTheDocument();
    expect(await screen.findByRole("heading", { name: "Heat" })).toBeInTheDocument();
    expect(screen.getByText("★ 8.3")).toBeInTheDocument();
    expect(screen.getByText("1995")).toBeInTheDocument();
    expect(screen.getByText("170분")).toBeInTheDocument();
    expect(screen.getByText("R")).toBeInTheDocument();
    expect(screen.getByText("♥ 1,234")).toBeInTheDocument();
    expect(
      screen.getByText("A group of professional bank robbers.")
    ).toBeInTheDocument();
    expect(screen.getByText("Al Pacino")).toBeInTheDocument();
  });

  it("장르 칩은 해당 장르 목록으로 연결된다", async () => {
    mockDetailApi(fullMovie);
    renderDetail();

    expect(await screen.findByRole("link", { name: "Crime" })).toHaveAttribute(
      "href",
      "/?genre=Crime"
    );
  });

  it("비슷한 영화를 보여준다", async () => {
    mockDetailApi(fullMovie, [makeMovie(8, "Collateral")]);
    renderDetail();

    expect(await screen.findByText("비슷한 영화")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Collateral" })).toHaveAttribute(
      "href",
      "/movie/8"
    );
  });

  it("비슷한 영화가 없으면 섹션을 숨긴다", async () => {
    mockDetailApi(fullMovie, []);
    renderDetail();

    await screen.findByRole("heading", { name: "Heat" });
    expect(screen.queryByText("비슷한 영화")).not.toBeInTheDocument();
  });

  it("비슷한 영화 요청이 실패해도 상세는 정상 표시된다", async () => {
    mockFetch((url) =>
      url.includes("movie_suggestions")
        ? { ok: false, status: 500 }
        : { body: apiOk({ movie: fullMovie }) }
    );
    renderDetail();

    expect(await screen.findByRole("heading", { name: "Heat" })).toBeInTheDocument();
    expect(screen.queryByText("비슷한 영화")).not.toBeInTheDocument();
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  });

  it("예고편은 버튼을 누르기 전에는 불러오지 않는다", async () => {
    mockDetailApi(fullMovie);
    renderDetail();

    await screen.findByRole("heading", { name: "Heat" });
    expect(screen.queryByTitle("Heat 예고편")).not.toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /예고편 보기/ }));

    expect(screen.getByTitle("Heat 예고편")).toHaveAttribute(
      "src",
      expect.stringContaining("youtube-nocookie.com/embed/abc123")
    );
  });

  it("예고편 코드가 없으면 버튼을 보여주지 않는다", async () => {
    mockDetailApi({ ...fullMovie, yt_trailer_code: undefined });
    renderDetail();

    await screen.findByRole("heading", { name: "Heat" });
    expect(screen.queryByRole("button", { name: /예고편/ })).not.toBeInTheDocument();
  });

  it("없는 영화(API가 id 0, title null로 응답)는 찾을 수 없음 화면을 보여준다", async () => {
    mockDetailApi({ ...makeMovie(0), id: 0, title: null });
    renderDetail("99999999");

    expect(await screen.findByText("영화를 찾을 수 없어요")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "홈으로 이동" })).toHaveAttribute(
      "href",
      "/"
    );
  });

  it("요청이 실패하면 에러 화면을 보여주고 다시 시도하면 복구된다", async () => {
    let failing = true;
    mockFetch((url) => {
      if (url.includes("movie_suggestions")) return { body: apiOk({ movies: [] }) };
      if (failing) return { ok: false, status: 503 };
      return { body: apiOk({ movie: fullMovie }) };
    });
    renderDetail();

    expect(
      await screen.findByText("영화 정보를 불러오지 못했어요")
    ).toBeInTheDocument();
    expect(screen.getByText("서버 응답 오류 (503)")).toBeInTheDocument();

    failing = false;
    await user.click(screen.getByRole("button", { name: "다시 시도" }));
    expect(await screen.findByRole("heading", { name: "Heat" })).toBeInTheDocument();
  });

  it("탭 제목을 영화 제목으로 바꾼다", async () => {
    mockDetailApi(fullMovie);
    renderDetail();

    await screen.findByRole("heading", { name: "Heat" });
    expect(document.title).toBe("Heat · Movie App");
  });
});

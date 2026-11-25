import React from "react";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Movie from "./Movie";

describe("Movie", () => {
  const renderMovie = () =>
    render(
      <MemoryRouter>
        <Movie id={42} coverImg="https://img.test/42.jpg" title="Heat" genres={["Crime"]} />
      </MemoryRouter>
    );

  it("제목과 포스터를 보여준다", () => {
    renderMovie();
    expect(screen.getByRole("img", { name: "Heat" })).toHaveAttribute(
      "src",
      "https://img.test/42.jpg"
    );
    expect(screen.getByRole("link", { name: "Heat" })).toBeInTheDocument();
  });

  it("제목 링크는 상세 페이지로 연결된다", () => {
    renderMovie();
    expect(screen.getByRole("link", { name: "Heat" })).toHaveAttribute(
      "href",
      "/movie/42"
    );
  });
});

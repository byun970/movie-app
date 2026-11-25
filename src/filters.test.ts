import { DEFAULT_SORT, isSortValue, SORT_OPTIONS } from "./filters";

describe("isSortValue", () => {
  it("정의된 정렬 값만 통과시킨다", () => {
    SORT_OPTIONS.forEach((o) => expect(isSortValue(o.value)).toBe(true));
    expect(isSortValue("nope")).toBe(false);
    expect(isSortValue(null)).toBe(false);
    expect(isSortValue("")).toBe(false);
  });

  it("기본 정렬은 유효한 값이다", () => {
    expect(isSortValue(DEFAULT_SORT)).toBe(true);
  });
});

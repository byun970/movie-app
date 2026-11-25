import "@testing-library/jest-dom";

// jsdom에는 IntersectionObserver와 scrollTo가 없어서 기본 대체물을 둔다.
// 무한 스크롤처럼 동작이 필요한 테스트는 직접 다시 덮어쓴다.
class NoopObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
  takeRecords() {
    return [];
  }
}
(window as any).IntersectionObserver = NoopObserver;
window.scrollTo = (() => {}) as typeof window.scrollTo;

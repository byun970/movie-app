import { useEffect, useRef } from "react";

// 반환된 ref를 붙인 요소가 화면 근처에 오면 onReach를 호출한다.
// enabled가 false에서 true로 바뀔 때마다 관찰을 새로 시작해서,
// 새로 불러온 뒤에도 여전히 화면 안에 있으면 이어서 다음 페이지를 부른다.
export const useInfiniteScroll = (onReach: () => void, enabled: boolean) => {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!enabled || !el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) onReach();
      },
      { rootMargin: "400px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [enabled, onReach]);

  return ref;
};

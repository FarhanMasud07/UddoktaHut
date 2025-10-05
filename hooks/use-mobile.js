import { useState, useEffect } from "react";

const MOBILE_BREAKPOINT = 768;

export function useIsMobile(breakPoint = MOBILE_BREAKPOINT) {
  const [isMobile, setIsMobile] = useState(undefined);

  useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${breakPoint - 1}px)`);
    const onChange = () => {
      setIsMobile(window.innerWidth < breakPoint);
    };
    mql.addEventListener("change", onChange);
    setIsMobile(window.innerWidth < breakPoint);
    return () => mql.removeEventListener("change", onChange);
  }, [breakPoint]);

  return !!isMobile;
}

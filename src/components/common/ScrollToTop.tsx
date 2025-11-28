import { useEffect } from "react";
import { useLocation } from "react-router";
import { getHashAwarePathname } from "../../utils/hashNavigation";

export function ScrollToTop() {
  const location = useLocation();
  const currentPath = getHashAwarePathname(location);

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth",
    });
  }, [currentPath]);

  return null;
}

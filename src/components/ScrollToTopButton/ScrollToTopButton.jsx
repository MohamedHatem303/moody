import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

export default function ScrollToTopButton({
  isLeftSidebarOpen,
  isRightSidebarOpen,
}) {
  const [show, setShow] = useState(false);
  const location = useLocation();

  // يظهر بس في صفحة الهوم
  const isHome = location.pathname === "/Home";

  useEffect(() => {
    if (!isHome) {
      setShow(false);
      return;
    }

    const handleScroll = () => {
      setShow(window.scrollY > 300);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isHome]);

  // يختفي في الموبايل لو أي سايدبار مفتوح
  const hideOnMobileSidebar =
    window.innerWidth < 768 && (isLeftSidebarOpen || isRightSidebarOpen);

  if (!show || !isHome || hideOnMobileSidebar) return null;

  return (
    <button
      onClick={() =>
        window.scrollTo({
          top: 0,
          behavior: "smooth",
        })
      }
      className="
        fixed bottom-6 right-6 z-50
        w-12 h-12 rounded-full
        bg-[#7C3AED] text-white
        flex items-center justify-center
        shadow-lg hover:bg-[#6D28D9]
        transition-all duration-300
      "
      aria-label="Scroll to top"
    >
      <i className="fa-solid fa-arrow-up"></i>
    </button>
  );
}

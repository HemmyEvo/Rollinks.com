"use client";

import { useEffect, useState } from "react";
import { ArrowDown, ArrowUp } from "lucide-react";

export default function ScrollButton() {
  const [show, setShow] = useState(false);
  const [atTop, setAtTop] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const isAtBottom =
        window.innerHeight + scrollTop >= document.body.offsetHeight - 100;
      setAtTop(scrollTop < 50);
      setShow(!isAtBottom);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleClick = () => {
    if (atTop) {
      window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return show ? (
    <button
      onClick={handleClick}
      aria-label={atTop ? "Scroll to Bottom" : "Scroll to Top"}
      className="fixed bottom-6 right-6 z-50 rounded-full bg-black/80 text-white p-3 shadow-lg hover:bg-black transition-colors"
    >
      {atTop ? <ArrowDown className="w-5 h-5" /> : <ArrowUp className="w-5 h-5" />}
    </button>
  ) : null;
}
import React, { useEffect, useRef, useContext } from "react";
import { ActiveSectionContext } from "../context/ActiveSectionContext";

const Introduction: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { setActiveSection } = useContext(ActiveSectionContext);

  useEffect(() => {
    const el = sectionRef.current;

    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection("introduction");
          }
        });
      },
      { threshold: 0.5 }
    );

    observer.observe(el);

    return () => {
      observer.unobserve(el);
    };
  }, [setActiveSection]);

  return (
    <section ref={sectionRef} id="introduction" className="min-h-screen p-6">
      <h2 className="text-3xl font-bold mb-4">Introduction</h2>
      <p>Content for the introduction section...</p>
    </section>
  );
};

export default Introduction;

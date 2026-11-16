"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import Image from "next/image";

/* ------------------------------------------------------------------ */
/* CONTENT: edit here. Add objects to PRODUCTS to add more tabs.       */
/* ------------------------------------------------------------------ */

const HEADING = "Secretary: Your Super AI Assistant App"; // placeholder: use your product's name
const LABEL = "No worries! Your secretary is here, let it manage.";

/** Put your logo PNG in /public and point to it here. */
const LOGO_SRC = "/logo.png";
const LOGO_ALT = "Product logo";

type Product = {
  id: string;
  title: string;
  description: string;
};

const PRODUCTS: Product[] = [
  {
    id: "01",
    title: "Super app",
    description: "One app for the things you do every day, instead of ten.",
  },
  {
    id: "02",
    title: "Personal assistant",
    description:
      "Keeps track of your plans, reminders and routine tasks so you don't have to.",
  },
  {
    id: "03",
    title: "AI app",
    description: "Ask in plain language and get things done, powered by AI.",
  },
];

const AUTO_PLAY_DURATION = 5000;

/* ------------------------------------------------------------------ */

export default function HomeProducts() {
  const reduceMotion = useReducedMotion();
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const handleNext = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % PRODUCTS.length);
  }, []);

  const handleTabClick = (index: number) => {
    if (index === activeIndex) return;
    setActiveIndex(index);
    setIsPaused(false);
  };

  useEffect(() => {
    if (isPaused || reduceMotion) return;

    const interval = setInterval(() => {
      handleNext();
    }, AUTO_PLAY_DURATION);

    return () => clearInterval(interval);
  }, [activeIndex, isPaused, reduceMotion, handleNext]);

  return (
    <section className="w-full bg-background py-8 md:py-16 lg:py-24">
      <div className="w-full px-4 md:px-8 lg:px-12 xl:px-20 mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Left Column: Content */}
          <div className="lg:col-span-5 flex flex-col justify-center order-2 lg:order-1 pt-4">
            <div className="space-y-1 mb-12">
              <h2 className="tracking-tighter text-balance text-3xl font-medium md:text-4xl lg:text-5xl text-foreground">
                {HEADING}
              </h2>
              <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-[0.3em] block ml-0.5">
                {LABEL}
              </span>
            </div>

            {/* The grid stacks the real list on top of invisible copies of itself,
                one per open tab. The block's height is always the tallest
                state, so it never changes when tabs open and close. */}
            <div className="grid">
              {PRODUCTS.map((_, open) => (
                <div
                  key={`sizer-${open}`}
                  aria-hidden="true"
                  className="invisible pointer-events-none col-start-1 row-start-1 flex flex-col"
                >
                  {PRODUCTS.map((product, i) => (
                    <div
                      key={product.id}
                      className="flex items-start gap-4 py-6 md:py-8 border-t border-border/50 first:border-0"
                    >
                      <span className="text-[9px] md:text-[10px] font-medium mt-1 tabular-nums opacity-50">
                        /{product.id}
                      </span>
                      <div className="flex flex-col gap-2 flex-1">
                        <span className="text-2xl md:text-3xl lg:text-4xl font-normal tracking-tight">
                          {product.title}
                        </span>
                        {i === open && (
                          <p className="text-sm md:text-base font-normal leading-relaxed max-w-sm pb-2">
                            {product.description}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ))}

            <div
              className="col-start-1 row-start-1 flex flex-col space-y-0"
              onMouseEnter={() => setIsPaused(true)}
              onMouseLeave={() => setIsPaused(false)}
            >
              {PRODUCTS.map((product, index) => {
                const isActive = activeIndex === index;
                return (
                  <button
                    key={product.id}
                    type="button"
                    onClick={() => handleTabClick(index)}
                    aria-current={isActive}
                    className={`group relative flex items-start gap-4 py-6 md:py-8 text-left transition-all duration-500 border-t border-border/50 first:border-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400 ${
                      isActive
                        ? "text-foreground"
                        : "text-muted-foreground/60 hover:text-foreground"
                    }`}
                  >
                    <div className="absolute left-[-16px] md:left-[-24px] top-0 bottom-0 w-[2px] bg-foreground/10">
                      {isActive && (
                        <motion.div
                          key={`progress-${index}-${isPaused}`}
                          className="absolute top-0 left-0 w-full bg-foreground origin-top"
                          initial={{ height: "0%" }}
                          animate={
                            isPaused || reduceMotion
                              ? { height: "0%" }
                              : { height: "100%" }
                          }
                          transition={{
                            duration: AUTO_PLAY_DURATION / 1000,
                            ease: "linear",
                          }}
                        />
                      )}
                    </div>

                    <span className="text-[9px] md:text-[10px] font-medium mt-1 tabular-nums opacity-50">
                      /{product.id}
                    </span>

                    <div className="flex flex-col gap-2 flex-1">
                      <span
                        className={`text-2xl md:text-3xl lg:text-4xl font-normal tracking-tight transition-colors duration-500 ${
                          isActive ? "text-foreground" : ""
                        }`}
                      >
                        {product.title}
                      </span>

                      <AnimatePresence mode="wait">
                        {isActive && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{
                              duration: 0.3,
                              ease: [0.23, 1, 0.32, 1],
                            }}
                            className="overflow-hidden"
                          >
                            <p className="text-muted-foreground text-sm md:text-base font-normal leading-relaxed max-w-sm pb-2">
                              {product.description}
                            </p>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </button>
                );
              })}
            </div>
            </div>
          </div>

          {/* Right Column: static logo, vertically centered against the left
              block. The left block has a constant height (see above), so the
              logo is centered and never moves. */}
          <div className="lg:col-span-7 flex items-center justify-center order-1 lg:order-2 lg:self-center">
            <div className="relative h-24 w-24 select-none md:h-40 md:w-40 lg:h-56 lg:w-56">
              <Image
                src={LOGO_SRC}
                alt={LOGO_ALT}
                fill
                sizes="224px"
                draggable={false}
                className="pointer-events-none object-contain"
                priority
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

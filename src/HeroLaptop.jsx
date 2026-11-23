import React, { useEffect, useState } from "react";
import { Laptop } from "lucide-react";

/* A 3D laptop built from CSS transforms (no extra libraries).
   The lid opens once on load, then the whole model slowly sways.
   The screen cycles through your featured listings. */

const fallbackItems = [
  {
    id: "f1",
    name: "MacBook Air M2",
    price: 39999,
    processor: "Apple M2",
    ram: "8GB",
    storage: "256GB SSD",
  },
  {
    id: "f2",
    name: "Lenovo ThinkPad T14",
    price: 24500,
    processor: "Intel Core i5",
    ram: "16GB",
    storage: "512GB SSD",
  },
  {
    id: "f3",
    name: "ASUS TUF Gaming F15",
    price: 38999,
    processor: "Intel Core i5",
    ram: "16GB",
    storage: "512GB SSD",
  },
];

const money = (n) => "₱" + Number(n).toLocaleString("en-PH");

function HeroLaptop({ items }) {
  const slides = items && items.length ? items.slice(0, 3) : fallbackItems;
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (slides.length < 2) return undefined;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return undefined;
    const timer = setInterval(
      () => setIndex((i) => (i + 1) % slides.length),
      3600
    );
    return () => clearInterval(timer);
  }, [slides.length]);

  const item = slides[index % slides.length];

  return (
    <div className="laptop-stage" aria-hidden="true">
      <div className="laptop-glow" />
      <div className="laptop-scale">
        <div className="laptop">
          <div className="laptop-base">
            <div className="face base-top">
              <div className="deck-light" />
              <div className="keys" />
              <div className="trackpad" />
            </div>
            <div className="face base-bottom" />
            <div className="face base-front" />
            <div className="face base-back" />
            <div className="face base-left" />
            <div className="face base-right" />

            <div className="lid-hinge">
              <div className="lid-box">
                <div className="face lid-screen">
                  <div className="display">
                    <div className="ui-bar">
                      <span className="ui-logo">
                        <Laptop size={9} />
                      </span>
                      <span className="ui-brand">Laptop Shop PH</span>
                      <span className="ui-search" />
                    </div>

                    <div className="ui-body" key={item.id}>
                      <div className="ui-info">
                        <span className="ui-kicker">Featured laptop</span>
                        <strong className="ui-name">{item.name}</strong>
                        <span className="ui-price">{money(item.price)}</span>
                        <div className="ui-chips">
                          {[item.processor, item.ram, item.storage]
                            .filter(Boolean)
                            .map((chip) => (
                              <span key={chip}>{chip}</span>
                            ))}
                        </div>
                      </div>
                      <div className="ui-art">
                        <Laptop size={54} strokeWidth={1.4} />
                      </div>
                    </div>

                    <div className="ui-dots">
                      {slides.map((s, i) => (
                        <span
                          key={s.id}
                          className={i === index % slides.length ? "on" : ""}
                        />
                      ))}
                    </div>
                  </div>
                  <span className="camera" />
                </div>
                <div className="face lid-back">
                  <span className="lid-mark" />
                </div>
                <div className="face lid-top" />
                <div className="face lid-bottom" />
                <div className="face lid-left" />
                <div className="face lid-right" />
              </div>
            </div>
          </div>
        </div>
        <div className="laptop-shadow" />
      </div>
    </div>
  );
}

export default HeroLaptop;

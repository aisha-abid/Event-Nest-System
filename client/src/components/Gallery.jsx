import React, { useEffect, useState } from "react";
import { assets, galleryImages } from "../assets/assets";
import Title from "./Title";

const Gallery = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const currentItem = galleryImages[currentSlide];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % galleryImages.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + galleryImages.length) % galleryImages.length);
  };

  useEffect(() => {
    const interval = setInterval(nextSlide, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div id="gallery" className="flex flex-col items-center justify-center ">
      <Title align="left" title="Our Gallery" />
      <div className="flex items-center">
        <button
          onClick={prevSlide}
          className="md:p-2 p-1 bg-black/30 md:mr-6 mr-2 rounded-full hover:bg-black/50"
        >
          <img src={assets.prevArrow} alt="Prev arrow" className="h-9" loading="lazy" decoding="async" />
        </button>

        <div className="w-full max-w-3xl overflow-hidden relative h-auto">
          <figure key={currentItem._id} className="relative w-full rounded-xl overflow-hidden">
            <img
              src={currentItem.image}
              alt={currentItem.title}
              className="w-full h-full object-cover"
              decoding="async"
            />
            <figcaption className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-black/60 text-white px-4 py-2 rounded-xl text-center">
              <h3 className="text-sm md:text-base font-semibold">{currentItem.title}</h3>
              <p className="text-xs md:text-sm opacity-90 text-[#41cfec]">Hosted by Event Nest</p>
            </figcaption>
          </figure>
        </div>

        <button
          onClick={nextSlide}
          className="p-1 md:p-2 bg-black/30 md:ml-6 ml-2 rounded-full hover:bg-black/50"
        >
          <img src={assets.nextArrow} alt="Next arrow" className="h-9" loading="lazy" decoding="async" />
        </button>
      </div>
    </div>
  );
};

export default Gallery;

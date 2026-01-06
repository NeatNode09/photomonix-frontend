import React, { useState } from "react";

interface BeforeAfterImage {
  before: string;
  after: string;
  title: string;
}

const showcaseImages: BeforeAfterImage[] = [
  {
    before: "/results/orginal_2.jpeg",
    after: "/results/test_2.png",
    title: "Product Enhancement",
  },
  {
    before: "/results/orginal_3.jpeg",
    after: "/results/test_3.png",
    title: "Professional Look",
  },
  {
    before: "/results/orginal_4.jpeg",
    after: "/results/test_4.png",
    title: "Studio Quality",
  },
  {
    before: "/results/orginal_5.jpeg",
    after: "/results/test_5.png",
    title: "Background Removal",
  },
  {
    before: "/results/orginal_6.jpeg",
    after: "/results/test_6.png",
    title: "Enhanced Clarity",
  },
  {
    before: "/results/orginal_7.png",
    after: "/results/test_7.png",
    title: "Color Perfection",
  },
];

const BeforeAfterShowcase = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [sliderPosition, setSliderPosition] = useState(50);

  const handlePrevious = () => {
    setCurrentIndex((prev) =>
      prev === 0 ? showcaseImages.length - 1 : prev - 1
    );
  };

  const handleNext = () => {
    setCurrentIndex((prev) =>
      prev === showcaseImages.length - 1 ? 0 : prev + 1
    );
  };

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSliderPosition(Number(e.target.value));
  };

  return (
    <section className="py-1 px-4 bg-linear-to-b from-gray-900 via-slate-900 to-gray-950">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-cyan-500/10 backdrop-blur-sm rounded-full text-cyan-300 text-sm font-medium mb-6 border border-cyan-500/30">
            <span>AI-Powered Results</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            See the{" "}
            <span className="bg-linear-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
              Magic in Action
            </span>
          </h2>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            Drag the slider to compare original images with AI-enhanced versions
          </p>
        </div>

        {/* Before/After Slider */}
        <div className="w-full mx-auto px-4">
          <div className="relative bg-gray-800/50 rounded-2xl overflow-hidden shadow-2xl ">
            {/* Image Container */}
            <div
              className="relative overflow-hidden bg-gray-900"
              style={{ minHeight: "700px", height: "75vh", maxHeight: "850px" }}
            >
              {/* After Image (Full) */}
              <img
                src={showcaseImages[currentIndex].after}
                alt={`${showcaseImages[currentIndex].title} - Enhanced`}
                className="absolute inset-0 w-full h-full object-contain"
              />

              {/* Before Image (Clipped) */}
              <div
                className="absolute inset-0 overflow-hidden transition-all duration-100"
                style={{
                  clipPath: `polygon(0 0, ${sliderPosition}% 0, ${sliderPosition}% 100%, 0 100%)`,
                }}
              >
                <img
                  src={showcaseImages[currentIndex].before}
                  alt={`${showcaseImages[currentIndex].title} - Original`}
                  className="absolute inset-0 w-full h-full object-contain"
                />
              </div>

              {/* Slider Line */}
              <div
                className="absolute top-0 bottom-0 w-1 bg-white shadow-lg transition-all duration-100 pointer-events-none"
                style={{ left: `calc(${sliderPosition}% - 2px)` }}
              >
                {/* Slider Handle */}
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-white rounded-full shadow-xl flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-gray-800"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 9l4-4 4 4m0 6l-4 4-4-4"
                    />
                  </svg>
                </div>
              </div>

              {/* Labels */}
              <div className="absolute top-4 left-4 px-3 py-1.5 bg-black/70 backdrop-blur-sm rounded-lg text-white text-sm font-medium pointer-events-none">
                Before
              </div>
              <div className="absolute top-4 right-4 px-3 py-1.5 bg-black/70 backdrop-blur-sm rounded-lg text-white text-sm font-medium pointer-events-none">
                After
              </div>

              {/* Slider Input */}
              <input
                type="range"
                min="0"
                max="100"
                value={sliderPosition}
                onChange={handleSliderChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize z-10"
                aria-label="Drag to compare before and after images"
                title="Slider to compare images"
              />
            </div>

            {/* Image Info */}
            <div className="p-6 bg-gray-800/80 backdrop-blur-sm border-t border-gray-700">
              <h3 className="text-xl font-semibold text-white mb-2">
                {showcaseImages[currentIndex].title}
              </h3>
              <p className="text-gray-400 text-sm">
                Drag the slider above to see the before and after comparison
              </p>
            </div>
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center justify-center gap-4 mt-8">
            <button
              onClick={handlePrevious}
              className="p-3 rounded-full bg-gray-800 hover:bg-gray-700 text-white transition-all duration-300 hover:scale-110 border border-gray-600"
              aria-label="Previous image"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>

            {/* Dots Indicator */}
            <div className="flex gap-2">
              {showcaseImages.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`transition-all duration-300 rounded-full ${
                    index === currentIndex
                      ? "w-8 h-3 bg-cyan-400"
                      : "w-3 h-3 bg-gray-600 hover:bg-gray-500"
                  }`}
                  aria-label={`Go to image ${index + 1}`}
                />
              ))}
            </div>

            <button
              onClick={handleNext}
              className="p-3 rounded-full bg-gray-800 hover:bg-gray-700 text-white transition-all duration-300 hover:scale-110 border border-gray-600"
              aria-label="Next image"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BeforeAfterShowcase;

import React from "react";

const AboutSection = () => {
  return (
    <section
      id="about"
      className="relative py-20 px-4 bg-linear-to-br from-gray-950 via-slate-900 to-gray-950 scroll-mt-20"
    >
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/10 backdrop-blur-sm rounded-full text-blue-300 text-sm font-medium mb-6 border border-blue-500/30">
            <span>About Us</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Transforming Images with
            <br />
            <span className="bg-linear-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              AI-Powered Technology
            </span>
          </h2>
          <p className="text-lg text-gray-300 max-w-3xl mx-auto leading-relaxed">
            PhotoMonix is your trusted partner for professional image
            enhancement. We combine cutting-edge AI technology with intuitive
            design to deliver studio-quality results in seconds.
          </p>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
          {/* Left: Mission & Vision */}
          <div className="space-y-8">
            <div className="bg-gray-800/40 backdrop-blur-sm rounded-2xl p-8 border border-gray-700/50">
              <div className="flex items-start gap-4 mb-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-linear-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white mb-3">
                    Our Mission
                  </h3>
                  <p className="text-gray-300 leading-relaxed">
                    To make professional-grade image enhancement accessible to
                    everyone—from small businesses to large enterprises. We
                    believe great visuals shouldn't require expensive software
                    or technical expertise.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gray-800/40 backdrop-blur-sm rounded-2xl p-8 border border-gray-700/50">
              <div className="flex items-start gap-4 mb-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-linear-to-br from-cyan-500 to-teal-500 flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white mb-3">
                    Our Vision
                  </h3>
                  <p className="text-gray-300 leading-relaxed">
                    To become the go-to platform for AI-powered image
                    enhancement worldwide. We're building a future where perfect
                    product images are just one click away, helping businesses
                    showcase their offerings beautifully.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Stats */}
          <div className="grid grid-cols-2 gap-6">
            <div className="bg-gray-800/40 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50 text-center">
              <div className="text-4xl font-bold mb-2">
                <span className="bg-linear-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                  10K+
                </span>
              </div>
              <p className="text-gray-300 font-medium">Images Enhanced</p>
            </div>

            <div className="bg-gray-800/40 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50 text-center">
              <div className="text-4xl font-bold mb-2">
                <span className="bg-linear-to-r from-cyan-400 to-teal-400 bg-clip-text text-transparent">
                  &lt;15s
                </span>
              </div>
              <p className="text-gray-300 font-medium">Average Processing</p>
            </div>

            <div className="bg-gray-800/40 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50 text-center">
              <div className="text-4xl font-bold mb-2">
                <span className="bg-linear-to-r from-teal-400 to-emerald-400 bg-clip-text text-transparent">
                  99.9%
                </span>
              </div>
              <p className="text-gray-300 font-medium">Satisfaction Rate</p>
            </div>

            <div className="bg-gray-800/40 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50 text-center">
              <div className="text-4xl font-bold mb-2">
                <span className="bg-linear-to-r from-emerald-400 to-green-400 bg-clip-text text-transparent">
                  24/7
                </span>
              </div>
              <p className="text-gray-300 font-medium">AI Availability</p>
            </div>
          </div>
        </div>

        {/* Why Choose Us */}
        <div className="bg-gray-800/40 backdrop-blur-sm rounded-2xl p-8 border border-gray-700/50">
          <h3 className="text-2xl font-bold text-white mb-6 text-center">
            Why Choose PhotoMonix?
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-500/20 text-blue-400 mb-4">
                <svg
                  className="w-6 h-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                  />
                </svg>
              </div>
              <h4 className="text-white font-semibold mb-2">
                AI-Powered Intelligence
              </h4>
              <p className="text-gray-400 text-sm">
                Advanced machine learning algorithms analyze and enhance your
                images automatically
              </p>
            </div>

            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-cyan-500/20 text-cyan-400 mb-4">
                <svg
                  className="w-6 h-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h4 className="text-white font-semibold mb-2">Lightning Fast</h4>
              <p className="text-gray-400 text-sm">
                Get professional results in seconds, not hours—perfect for
                businesses with tight deadlines
              </p>
            </div>

            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-teal-500/20 text-teal-400 mb-4">
                <svg
                  className="w-6 h-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
              </div>
              <h4 className="text-white font-semibold mb-2">
                Secure & Private
              </h4>
              <p className="text-gray-400 text-sm">
                Your images are processed securely and never stored permanently
                on our servers
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;

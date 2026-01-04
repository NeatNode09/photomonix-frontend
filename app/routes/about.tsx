import { Link } from "react-router";

export default function About() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-950 text-slate-100">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold text-sky-400 mb-6">
            About Photomonix
          </h1>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
            Transform your product images with cutting-edge AI technology
          </p>
        </div>

        <section className="mb-16">
          <div className="bg-slate-800/50 rounded-2xl p-8 md:p-12 border border-slate-700">
            <h2 className="text-3xl font-bold text-emerald-400 mb-6">
              Our Mission
            </h2>
            <p className="text-slate-300 text-lg leading-relaxed mb-4">
              Photomonix empowers individuals and teams to create stunning,
              professional-grade product images using advanced AI technology. We
              believe that high-quality visual content should be accessible to
              everyone, regardless of technical expertise or resources.
            </p>
            <p className="text-slate-300 text-lg leading-relaxed">
              Our AI-powered platform transforms ordinary product photos into
              enhanced, studio-quality images with just a few clicks, helping
              businesses showcase their products in the best possible light.
            </p>
          </div>
        </section>

        <section className="mb-16">
          <h2 className="text-3xl font-bold text-sky-400 mb-8 text-center">
            What We Offer
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700 hover:border-sky-500 transition-colors">
              <div className="w-12 h-12 bg-sky-500/20 rounded-lg flex items-center justify-center mb-4">
                <svg
                  className="w-6 h-6 text-sky-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">
                AI Image Enhancement
              </h3>
              <p className="text-slate-300">
                Automatically enhance lighting, background, composition, and
                style with intelligent AI suggestions.
              </p>
            </div>

            <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700 hover:border-emerald-500 transition-colors">
              <div className="w-12 h-12 bg-emerald-500/20 rounded-lg flex items-center justify-center mb-4">
                <svg
                  className="w-6 h-6 text-emerald-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">
                Instant Results
              </h3>
              <p className="text-slate-300">
                Get professional-quality enhanced images in seconds, not hours.
                No manual editing required.
              </p>
            </div>

            <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700 hover:border-sky-500 transition-colors">
              <div className="w-12 h-12 bg-sky-500/20 rounded-lg flex items-center justify-center mb-4">
                <svg
                  className="w-6 h-6 text-sky-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">
                Customizable Options
              </h3>
              <p className="text-slate-300">
                Choose from multiple enhancement categories including
                background, lighting, style, and focus.
              </p>
            </div>

            <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700 hover:border-emerald-500 transition-colors">
              <div className="w-12 h-12 bg-emerald-500/20 rounded-lg flex items-center justify-center mb-4">
                <svg
                  className="w-6 h-6 text-emerald-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">
                Secure & Private
              </h3>
              <p className="text-slate-300">
                Your images are processed securely and never shared. We respect
                your privacy and intellectual property.
              </p>
            </div>
          </div>
        </section>

        <section className="mb-16">
          <div className="bg-gradient-to-r from-sky-500/10 to-emerald-500/10 rounded-2xl p-8 md:p-12 border border-sky-500/30">
            <h2 className="text-3xl font-bold text-white mb-6 text-center">
              Powered by Advanced AI
            </h2>
            <p className="text-slate-300 text-lg leading-relaxed text-center max-w-3xl mx-auto mb-6">
              Photomonix leverages Google's Gemini AI technology to understand
              your images and provide intelligent enhancement suggestions
              tailored to your specific needs.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <span className="px-4 py-2 bg-slate-800 rounded-full text-sky-400 text-sm font-medium">
                Computer Vision
              </span>
              <span className="px-4 py-2 bg-slate-800 rounded-full text-emerald-400 text-sm font-medium">
                Generative AI
              </span>
              <span className="px-4 py-2 bg-slate-800 rounded-full text-sky-400 text-sm font-medium">
                Image Processing
              </span>
              <span className="px-4 py-2 bg-slate-800 rounded-full text-emerald-400 text-sm font-medium">
                Machine Learning
              </span>
            </div>
          </div>
        </section>

        <section className="text-center">
          <h2 className="text-3xl font-bold text-white mb-6">
            Ready to Transform Your Images?
          </h2>
          <p className="text-slate-300 text-lg mb-8 max-w-2xl mx-auto">
            Join thousands of businesses using Photomonix to create stunning
            product images that drive sales and engagement.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/register"
              className="px-8 py-3 bg-emerald-500 hover:bg-emerald-400 text-white rounded-full font-semibold transition-colors"
            >
              Get Started Free
            </Link>
            <Link
              to="/contact"
              className="px-8 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-full font-semibold transition-colors"
            >
              Contact Us
            </Link>
          </div>
        </section>

        <div className="mt-16 pt-8 border-t border-slate-700 text-center">
          <p className="text-slate-400">
            Built with ❤️ by{" "}
            <a
              href="https://www.neatnode.tech"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sky-400 hover:text-sky-300 transition-colors font-medium"
            >
              NeatNode Technologies
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

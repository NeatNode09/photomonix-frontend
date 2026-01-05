import React from "react";

interface Testimonial {
  name: string;
  role: string;
  company: string;
  image: string;
  content: string;
  rating: number;
}

const testimonials: Testimonial[] = [
  {
    name: "Sarah Mitchell",
    role: "E-commerce Manager",
    company: "StyleHub Co.",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
    content:
      "PhotoMonix transformed our product photography workflow. The AI suggestions are incredibly accurate, and we've reduced editing time by 70%. Our conversion rates have increased significantly!",
    rating: 5,
  },
  {
    name: "James Rodriguez",
    role: "Professional Photographer",
    company: "JR Studios",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=James",
    content:
      "As a professional photographer, I was skeptical at first. But PhotoMonix's AI-powered enhancements are genuinely impressive. It's become an essential tool in my post-processing workflow.",
    rating: 5,
  },
  {
    name: "Emily Chen",
    role: "Marketing Director",
    company: "TechVision Inc.",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Emily",
    content:
      "The speed and quality are unmatched. We can now enhance hundreds of images in the time it used to take us to edit a handful. The results are consistently professional.",
    rating: 5,
  },
  {
    name: "Michael Thompson",
    role: "Small Business Owner",
    company: "Artisan Goods",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Michael",
    content:
      "I don't have a background in photography, but PhotoMonix makes my product photos look professionally shot. The AI suggestions are easy to understand and implement.",
    rating: 5,
  },
  {
    name: "Lisa Anderson",
    role: "Social Media Manager",
    company: "BrandBoost",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Lisa",
    content:
      "Our social media engagement has skyrocketed since we started using PhotoMonix. The enhanced images grab attention and the quick turnaround means we can post more consistently.",
    rating: 5,
  },
  {
    name: "David Park",
    role: "Content Creator",
    company: "Creative Hub",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=David",
    content:
      "The before-and-after results are stunning. PhotoMonix has become my secret weapon for creating scroll-stopping content. Highly recommend to any content creator!",
    rating: 5,
  },
];

const StarRating = ({ rating }: { rating: number }) => {
  return (
    <div className="flex gap-1">
      {[...Array(5)].map((_, index) => (
        <svg
          key={index}
          className={`w-5 h-5 ${
            index < rating ? "text-yellow-400" : "text-gray-600"
          }`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
};

const TestimonialsSection = () => {
  return (
    <section className="relative py-20 px-4 bg-linear-to-br from-gray-950 via-slate-900 to-gray-950">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 left-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-cyan-500/10 backdrop-blur-sm rounded-full text-cyan-300 text-sm font-medium mb-6 border border-cyan-500/30">
            <span>What Our Users Say</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Trusted by Thousands of
            <br />
            <span className="bg-linear-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
              Happy Users
            </span>
          </h2>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            Don't just take our word for it. See what professionals and
            businesses are saying about PhotoMonix.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="group relative bg-gray-800/40 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50 hover:border-cyan-500/50 transition-all duration-300 hover:transform hover:scale-105"
            >
              {/* Quote icon */}
              <div className="absolute top-4 right-4 text-cyan-500/20 group-hover:text-cyan-500/30 transition-colors">
                <svg
                  className="w-10 h-10"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                </svg>
              </div>

              {/* Rating */}
              <div className="mb-4">
                <StarRating rating={testimonial.rating} />
              </div>

              {/* Content */}
              <p className="text-gray-300 leading-relaxed mb-6 text-sm">
                {testimonial.content}
              </p>

              {/* Author Info */}
              <div className="flex items-center gap-4 pt-4 border-t border-gray-700/50">
                <div className="relative w-12 h-12 rounded-full overflow-hidden ring-2 ring-cyan-500/30 group-hover:ring-cyan-500/50 transition-all">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h4 className="text-white font-semibold text-sm">
                    {testimonial.name}
                  </h4>
                  <p className="text-gray-400 text-xs">{testimonial.role}</p>
                  <p className="text-cyan-400 text-xs font-medium">
                    {testimonial.company}
                  </p>
                </div>
              </div>

              {/* Hover gradient effect */}
              <div className="absolute inset-0 rounded-2xl bg-linear-to-br from-cyan-500 to-blue-500 opacity-0 group-hover:opacity-5 transition-opacity duration-300 pointer-events-none" />
            </div>
          ))}
        </div>

        {/* Bottom Stats */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center p-6 bg-gray-800/30 backdrop-blur-sm rounded-xl border border-gray-700/50">
            <div className="text-4xl font-bold text-white mb-2">
              <span className="bg-linear-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                10,000+
              </span>
            </div>
            <p className="text-gray-400">Happy Users</p>
          </div>
          <div className="text-center p-6 bg-gray-800/30 backdrop-blur-sm rounded-xl border border-gray-700/50">
            <div className="text-4xl font-bold text-white mb-2">
              <span className="bg-linear-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                99.9%
              </span>
            </div>
            <p className="text-gray-400">Satisfaction Rate</p>
          </div>
          <div className="text-center p-6 bg-gray-800/30 backdrop-blur-sm rounded-xl border border-gray-700/50">
            <div className="text-4xl font-bold text-white mb-2">
              <span className="bg-linear-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                4.9/5
              </span>
            </div>
            <p className="text-gray-400">Average Rating</p>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <a
            href="#upload"
            className="inline-block px-8 py-4 bg-linear-to-r from-cyan-500 to-blue-500 text-white font-semibold rounded-full hover:from-cyan-600 hover:to-blue-600 transition-all duration-300 shadow-lg shadow-cyan-500/30 hover:shadow-cyan-500/50 hover:transform hover:scale-105"
          >
            Join Our Happy Users Today
          </a>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;

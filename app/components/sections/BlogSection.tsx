import React from "react";
import { Link } from "react-router";

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  author: string;
  authorAvatar: string;
  date: string;
  readTime: string;
  category: string;
  image: string;
  gradient: string;
}

const blogPosts: BlogPost[] = [
  {
    id: "1",
    title: "Professional Product Photography for E-commerce Success",
    excerpt:
      "Discover how stunning product photography drives sales and engagement. NeatNode helps product brands grow with conversion-focused imagery and smart marketing strategies.",
    author: "NeatNode Team",
    authorAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=NeatNode1",
    date: "Jan 3, 2026",
    readTime: "5 min read",
    category: "Creative",
    image:
      "https://images.unsplash.com/photo-1542038784456-1ea8e935640e?w=800&q=80",
    gradient: "from-blue-500 to-cyan-500",
  },
  {
    id: "2",
    title: "AI Chatbots & Agents: Automating Your Business",
    excerpt:
      "Learn how AI chatbots and automation help your team work less while scaling your business. Deploy intelligent agents that handle customer queries 24/7 with ease.",
    author: "NeatNode Tech",
    authorAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=NeatNode2",
    date: "Jan 1, 2026",
    readTime: "7 min read",
    category: "Technology",
    image:
      "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&q=80",
    gradient: "from-cyan-500 to-teal-500",
  },
  {
    id: "3",
    title: "E-commerce Marketing That Drives Real Orders",
    excerpt:
      "Turn browsers into buyers with conversion-first strategies. From paid ads to SEO and product listings, we share proven tactics for product brands to scale predictably.",
    author: "Marketing Team",
    authorAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=NeatNode3",
    date: "Dec 29, 2025",
    readTime: "6 min read",
    category: "Marketing",
    image:
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80",
    gradient: "from-teal-500 to-emerald-500",
  },
  {
    id: "4",
    title: "Building Conversion-Focused Websites & Apps",
    excerpt:
      "Design and build websites that convert visitors into customers. We focus on product brands with elegant technology paired with performance marketing for predictable growth.",
    author: "Dev Team",
    authorAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=NeatNode4",
    date: "Dec 25, 2025",
    readTime: "8 min read",
    category: "Web Development",
    image:
      "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&q=80",
    gradient: "from-emerald-500 to-green-500",
  },
  {
    id: "5",
    title: "Cloud & DevOps: Scalable Infrastructure for Growth",
    excerpt:
      "Deploy scalable cloud infrastructure that grows with your business. Learn how proper DevOps practices and cloud solutions help product brands launch quickly and stay reliable.",
    author: "Cloud Team",
    authorAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=NeatNode5",
    date: "Dec 22, 2025",
    readTime: "6 min read",
    category: "Technology",
    image:
      "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&q=80",
    gradient: "from-green-500 to-lime-500",
  },
  {
    id: "6",
    title: "Analytics & Dashboards: Data-Driven Decision Making",
    excerpt:
      "Make informed decisions with clear weekly results and analytics dashboards. Track what's working, optimize conversions, and scale your product brand with confidence.",
    author: "Data Team",
    authorAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=NeatNode6",
    date: "Dec 18, 2025",
    readTime: "5 min read",
    category: "Data & Growth",
    image:
      "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800&q=80",
    gradient: "from-lime-500 to-yellow-500",
  },
];

const BlogSection = () => {
  return (
    <section className="relative py-20 px-4 bg-linear-to-br from-slate-950 via-gray-900 to-slate-950">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/3 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/3 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/10 backdrop-blur-sm rounded-full text-emerald-300 text-sm font-medium mb-6 border border-emerald-500/30">
            <span>Latest Insights</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Tips, Guides &
            <br />
            <span className="bg-linear-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
              Expert Advice
            </span>
          </h2>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            Stay updated with the latest trends in image enhancement,
            photography tips, and AI technology insights.
          </p>
        </div>

        {/* Blog Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogPosts.map((post) => (
            <article
              key={post.id}
              className="group relative bg-gray-800/40 backdrop-blur-sm rounded-2xl overflow-hidden border border-gray-700/50 hover:border-emerald-500/50 transition-all duration-300 hover:transform hover:scale-105"
            >
              {/* Image */}
              <div className="relative h-48 overflow-hidden">
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
                {/* Category Badge */}
                <div
                  className={`absolute top-4 left-4 px-3 py-1 bg-linear-to-r ${post.gradient} rounded-full text-white text-xs font-semibold`}
                >
                  {post.category}
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                {/* Meta Info */}
                <div className="flex items-center gap-3 text-xs text-gray-400 mb-3">
                  <span className="flex items-center gap-1">
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    {post.date}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <svg
                      className="w-4 h-4"
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
                    {post.readTime}
                  </span>
                </div>

                {/* Title */}
                <h3 className="text-xl font-bold text-white mb-3 group-hover:text-emerald-400 transition-colors line-clamp-2">
                  {post.title}
                </h3>

                {/* Excerpt */}
                <p className="text-gray-400 text-sm leading-relaxed mb-4 line-clamp-3">
                  {post.excerpt}
                </p>

                {/* Author */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-700/50">
                  <div className="flex items-center gap-3">
                    <div className="relative w-8 h-8 rounded-full overflow-hidden ring-2 ring-emerald-500/30">
                      <img
                        src={post.authorAvatar}
                        alt={post.author}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <span className="text-sm text-gray-300 font-medium">
                      {post.author}
                    </span>
                  </div>

                  {/* Read More Arrow */}
                  <div className="flex items-center gap-1 text-emerald-400 group-hover:gap-2 transition-all">
                    <span className="text-sm font-medium">Read</span>
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Hover gradient overlay */}
              <div
                className={`absolute inset-0 bg-linear-to-br ${post.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300 pointer-events-none`}
              />
            </article>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center mt-12">
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 px-8 py-4 bg-gray-800/50 backdrop-blur-sm text-white font-semibold rounded-full border border-gray-700/50 hover:border-emerald-500/50 hover:bg-gray-800/70 transition-all duration-300 group"
          >
            <span>View All Articles</span>
            <svg
              className="w-5 h-5 group-hover:translate-x-1 transition-transform"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 8l4 4m0 0l-4 4m4-4H3"
              />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default BlogSection;

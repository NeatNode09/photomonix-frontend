import { useState } from "react";

const FORMSPREE_URL = "https://formspree.io/f/xaqnlddy";

export default function ContactSection() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [status, setStatus] = useState<
    "idle" | "submitting" | "success" | "error"
  >("idle");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("submitting");

    try {
      const res = await fetch(FORMSPREE_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error("Request failed");
      setStatus("success");
      setFormData({ name: "", email: "", message: "" });
    } catch (err) {
      setStatus("error");
    }
  };

  return (
    <section
      id="contact"
      className="relative py-16 px-4 bg-linear-to-br from-slate-950 via-gray-900 to-slate-950 scroll-mt-20"
    >
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/10 backdrop-blur-sm rounded-full text-emerald-300 text-sm font-medium mb-6 border border-emerald-500/30">
            <span>Get In Touch</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Let's Work{" "}
            <span className="bg-linear-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
              Together
            </span>
          </h2>
          <p className="text-gray-300 text-base max-w-2xl mx-auto">
            Have questions or feedback? Send us a message and we'll respond as
            soon as possible.
          </p>
        </div>

        <div className="bg-gray-800/40 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6 md:p-8">
          {status === "success" && (
            <div className="mb-4 p-3 bg-emerald-500/15 border border-emerald-500 text-emerald-200 rounded-lg text-sm">
              Thanks! Your message has been sent.
            </div>
          )}
          {status === "error" && (
            <div className="mb-4 p-3 bg-red-500/15 border border-red-500 text-red-200 rounded-lg text-sm">
              Something went wrong. Please try again.
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-300 mb-1.5"
              >
                Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                value={formData.name}
                onChange={handleChange}
                className="w-full rounded-xl bg-gray-900/50 border border-gray-700/50 px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/20 transition-all"
                placeholder="Jane Doe"
              />
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-300 mb-1.5"
              >
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="w-full rounded-xl bg-gray-900/50 border border-gray-700/50 px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/20 transition-all"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label
                htmlFor="message"
                className="block text-sm font-medium text-gray-300 mb-1.5"
              >
                Message
              </label>
              <textarea
                id="message"
                name="message"
                required
                rows={4}
                value={formData.message}
                onChange={handleChange}
                className="w-full rounded-xl bg-gray-900/50 border border-gray-700/50 px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/20 transition-all resize-none"
                placeholder="How can we help?"
              />
            </div>

            <button
              type="submit"
              disabled={status === "submitting"}
              className="w-full rounded-full bg-linear-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 disabled:from-gray-700 disabled:to-gray-700 disabled:cursor-not-allowed text-white font-semibold py-3 transition-all duration-300 shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/50"
            >
              {status === "submitting" ? "Sending..." : "Send Message"}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}

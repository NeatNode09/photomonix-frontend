import React from "react";
import type { Route } from "../+types/root";
import HeroSection from "@sections/HeroSection";
import FeaturesSection from "@sections/FeaturesSection";
import TestimonialsSection from "@sections/TestimonialsSection";
import BlogSection from "@sections/BlogSection";
import AboutSection from "@sections/AboutSection";
import ContactSection from "@sections/ContactSection";
import BeforeAfterShowcase from "@sections/BeforeAfterShowcase";
import Navbar from "~/components/layout/Navbar";
import Footer from "~/components/layout/Footer";

export function meta({}: Route.MetaArgs) {
  return [
    {
      title: "Photomonix - AI-Powered Image Enhancement",
    },
    {
      name: "description",
      content:
        "Transform your images with AI. Upload, analyze, and enhance with intelligent suggestions - all in one place.",
    },
  ];
}

const Home = () => {
  return (
    <div className="bg-linear-to-br from-gray-950 via-slate-900 to-gray-950">
      <Navbar />
      <HeroSection />
      <BeforeAfterShowcase />
      <FeaturesSection />
      <TestimonialsSection />
      <BlogSection />
      <AboutSection />
      <ContactSection />
      <Footer />
    </div>
  );
};

export default Home;

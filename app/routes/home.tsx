import React from "react";
import type { Route } from "../+types/root";
import HeroSection from "@sections/HeroSection";
import FeaturesSection from "@sections/FeaturesSection";
import TestimonialsSection from "@sections/TestimonialsSection";
import BlogSection from "@sections/BlogSection";
import BeforeAfterShowcase from "@sections/BeforeAfterShowcase";

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
    <>
      <HeroSection />
      <BeforeAfterShowcase />
      <FeaturesSection />
      <TestimonialsSection />
      <BlogSection />
    </>
  );
};

export default Home;

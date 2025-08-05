"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import Lottie from "lottie-react";

// Import your Lottie files from app/animations (adjust path if needed)
import heroAnimation from "./animations/Hero.json";
import aboutAnimation from "./animations/about.json";

export default function LandingPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <main className="bg-white text-gray-900">
      {/* Navbar */}
      <header className="fixed w-full bg-white shadow z-50 px-6 py-4 flex justify-between items-center">
        <h1 className="text-2xl font-extrabold text-purple-600">🚀 StartupMS</h1>

        {/* Desktop Menu */}
        <nav className="hidden md:flex gap-8 text-gray-700 font-medium">
          <a href="#about" className="hover:text-purple-600 transition">About</a>
          <a href="#features" className="hover:text-purple-600 transition">Features</a>
          <a href="#pricing" className="hover:text-purple-600 transition">Pricing</a>
          <a href="#faq" className="hover:text-purple-600 transition">FAQ</a>
        </nav>

        {/* Mobile Menu Button */}
        <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="md:hidden text-3xl text-purple-600">
          ☰
        </button>

        {/* Get Started */}
        <a
          href="./register"
          className="hidden md:block bg-purple-600 text-white px-5 py-2 rounded-full shadow hover:bg-purple-700 transition"
        >
        Sign Up
        </a>
      </header>

      {/* Mobile Drawer */}
      {isMenuOpen && (
        <div className="absolute top-16 left-0 w-full bg-white shadow-md p-6 flex flex-col gap-4 md:hidden">
          <a href="#about" className="hover:text-purple-600 transition">About</a>
          <a href="#features" className="hover:text-purple-600 transition">Features</a>
          <a href="#pricing" className="hover:text-purple-600 transition">Pricing</a>
          <a href="#faq" className="hover:text-purple-600 transition">FAQ</a>
          <a href="./register" className="bg-purple-600 text-white px-4 py-2 rounded-full text-center">Sign Up</a>
        </div>
      )}

      {/* Hero Section */}
      <section className="relative min-h-screen bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400 flex flex-col justify-center items-center text-center px-8 pt-32 text-white overflow-hidden">
        {/* Hero Animation Background */}
        <div className="absolute inset-0 flex justify-center items-center opacity-30 pointer-events-none">
          <Lottie animationData={heroAnimation} loop={true} style={{ width: "90%", height: "90%" }} />
        </div>

        {/* Hero Content */}
        <motion.h1
          className="relative z-10 text-5xl md:text-7xl font-extrabold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-yellow-300 to-white"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          Startup Management System
        </motion.h1>
        <p className="relative z-10 text-lg md:text-xl max-w-3xl mb-8">
          The ultimate toolkit to plan, pitch, track, and fund your startup — all in one modern platform.
        </p>
        <a
          href="#about"
          className="relative z-10 bg-white text-purple-600 font-semibold text-lg px-8 py-4 rounded-full shadow-lg hover:scale-105 transition transform"
        >
          About Us
        </a>
      </section>

      {/* About Section */}
      <section id="about" className="py-24 px-6 bg-gray-50">
        <h2 className="text-4xl font-bold text-center mb-12 text-purple-600">Why Choose Us?</h2>
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-12 items-center">
          <div className="flex-1 text-lg leading-relaxed">
            <p>
              We help startup founders stay organized, pitch confidently, and attract funding faster. Our system is built for speed and simplicity, so you can focus on what really matters — growing your business.
            </p>
            <ul className="mt-6 list-disc pl-6">
              <li>Streamlined task planning & progress tracking</li>
              <li>Investor-ready pitch deck management</li>
              <li>Cap table transparency for all stakeholders</li>
            </ul>
          </div>
          <div className="flex-1 flex justify-center">
            <Lottie animationData={aboutAnimation} loop={true} style={{ width: "100%", maxWidth: "400px" }} />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 px-6 bg-white">
        <h2 className="text-4xl font-bold text-center mb-14 text-orange-500">Features You’ll Love</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 max-w-7xl mx-auto">
          {[
            { title: "Task Planner", desc: "Organize and track all tasks in one dashboard." },
            { title: "Pitch Deck Hub", desc: "Centralize all your pitch materials." },
            { title: "Cap Table Tracker", desc: "Manage equity splits with ease." },
            { title: "Funding Timeline", desc: "Track every stage of your funding journey." },
          ].map((feature, i) => (
            <motion.div
              key={i}
              className="p-8 bg-gray-50 rounded-2xl shadow hover:shadow-xl transition text-center border border-gray-200"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.2 }}
            >
              <h3 className="text-xl font-bold text-purple-600 mb-3">{feature.title}</h3>
              <p>{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-24 px-6 bg-gray-50">
        <h2 className="text-4xl font-bold text-center mb-10 text-purple-600">FAQ</h2>
        <div className="max-w-4xl mx-auto space-y-6">
          {[
            { q: "What is StartupMS?", a: "It’s an all-in-one management system for startups." },
            { q: "Is there a free plan?", a: "Yes! We offer a free Starter plan." },
            { q: "Can I upgrade anytime?", a: "Absolutely, you can upgrade whenever you need." },
          ].map((faq, i) => (
            <details key={i} className="bg-white p-6 rounded-lg shadow">
              <summary className="cursor-pointer text-lg font-semibold">{faq.q}</summary>
              <p className="mt-2 text-gray-700">{faq.a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* Footer CTA */}
      <footer id="get-started" className="bg-gradient-to-r from-purple-600 to-pink-500 text-white py-20 text-center">
        <h2 className="text-4xl font-bold mb-6">Ready to Scale Your Startup?</h2>
        <a
          href="./register"
          className="bg-white text-purple-600 px-10 py-5 rounded-full shadow-lg text-xl font-semibold hover:bg-gray-200 transition"
        >
          Get Started Now
        </a>
        <p className="mt-8 text-gray-200">&copy; {new Date().getFullYear()} StartupMS. All rights reserved.</p>
      </footer>
    </main>
  );
}

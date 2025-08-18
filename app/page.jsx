"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import Lottie from "lottie-react";
import { Menu, X, ChevronDown } from "lucide-react";
import StartupsGraph from "@/components/StartupsGraph";
import heroAnimation from "./animations/Hero.json";
import aboutAnimation from "./animations/about.json";
import { scroller, Link } from "react-scroll";
import { Pie as PieChart, Bar as BarChart } from "react-chartjs-2";
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
} from "chart.js";

ChartJS.register(Title, Tooltip, Legend, ArcElement, CategoryScale, LinearScale, BarElement);

export default function LandingPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [openFAQ, setOpenFAQ] = useState(null);

  const toggleFAQ = (index) => {
    setOpenFAQ(openFAQ === index ? null : index);
  };

  const scrollToAbout = () => {
    scroller.scrollTo("about", {
      duration: 3200,
      smooth: "easeInOut",
    });
  };

  const scrollToGetStarted = () => {
    scroller.scrollTo("get-started", {
      duration: 3000,
      smooth: "easeInOut",
    });
  };

  // Example chart data
  const pitchDeckData = {
    labels: ["Failed", "Incorrect", "Unattractive"],
    datasets: [
      { data: [40, 35, 25], backgroundColor: ["#EF4444", "#F59E0B", "#3B82F6"] },
    ],
  };
  const taskData = {
    labels: ["Assigned", "Unassigned"],
    datasets: [
      { label: "Tasks", data: [75, 25], backgroundColor: ["#10B981", "#9CA3AF"] },
    ],
  };
  const fundingData = {
    labels: ["Success", "Rejected"],
    datasets: [
      { data: [60, 40], backgroundColor: ["#22C55E", "#EF4444"] },
    ],
  };

  const features = [
    { title: "📊 Pitch Deck Analyzer", desc: "AI detects mistakes, improves design, and boosts investor confidence." },
    { title: "✅ Smart Task Assignment", desc: "Assigns tasks to the right employees based on skills with minimum hustle." },
    { title: "💰 AI Funding Advisor", desc: "Finds investors, predicts funding success, and builds strategy." },
    { title: "📈 Efficient Employee Management", desc: "Track and manage employees efficiently." },
  ];

  const links = [
    { label: "Home", to: "home" },
    { label: "About", to: "about" },
    { label: "Features", to: "features" },
    { label: "Review", to: "review" },
    { label: "FAQ", to: "faq" },
  ];

  return (
    <main className="bg-white text-gray-900 scroll-smooth">
      {/* Navbar */}
      <header className="fixed w-full bg-white/80 backdrop-blur-md shadow z-50 px-4 sm:px-6 py-3 flex justify-between items-center h-16">
        <div className="flex items-center">
          <img src="/logowb.png" alt="Startify Logo" className="h-35 w-50" />
        </div>

        {/* Desktop Menu */}
        <nav className="hidden md:flex gap-6 text-gray-700 font-medium">
          {links.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              smooth
              duration={1000}
              offset={-70}
              className="relative group hover:text-[#FF6B1A] transition cursor-pointer"
            >
              {link.label}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#FF6B1A] transition-all group-hover:w-full"></span>
            </Link>
          ))}
        </nav>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="md:hidden text-2xl text-[#FF6B1A]"
        >
          {isMenuOpen ? <X /> : <Menu />}
        </button>

        {/* CTA */}
        <motion.button
          onClick={scrollToGetStarted}
          className="hidden md:block bg-gradient-to-r from-[#FF6B1A] to-[#FF8533] text-white px-4 py-2 rounded-full shadow hover:scale-105 transition"
          whileTap={{ scale: 0.95 }}
        >
          Join Now
        </motion.button>
      </header>

      {/* Mobile Drawer */}
      {isMenuOpen && (
        <motion.div
          initial={{ x: -200, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="absolute top-16 left-0 w-full bg-white shadow-md p-6 flex flex-col gap-4 md:hidden"
        >
          {links.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              smooth
              duration={1000}
              offset={-70}
              onClick={() => setIsMenuOpen(false)}
              className="cursor-pointer hover:text-[#FF6B1A] transition"
            >
              {link.label}
            </Link>
          ))}
          <a
            href="#get-started"
            className="bg-gradient-to-r from-[#FF6B1A] to-[#FF8533] text-white px-4 py-2 rounded-full text-center"
          >
            Join Now
          </a>
        </motion.div>
      )}

      {/* Hero Section */}
      <section
        id="home"
        className="relative min-h-screen flex flex-col justify-center items-center text-center px-4 pt-28 sm:px-8 text-white overflow-hidden bg-gradient-to-br from-[#0D2A4D] via-[#0B1E35] to-[#FF6B1A]"
      >
        <div className="absolute inset-0 flex justify-center items-center opacity-20 pointer-events-none">
          <Lottie animationData={heroAnimation} loop style={{ width: "100%", maxWidth: "700px" }} />
        </div>

        <motion.h1
          className="relative z-10 text-4xl sm:text-5xl md:text-7xl font-extrabold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-yellow-200 via-white to-pink-100"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
        >
          Startify
        </motion.h1>

        <motion.p
          className="relative z-10 text-base sm:text-lg md:text-xl max-w-2xl mb-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          "Where Startups Get Started"
        </motion.p>

        <motion.p
          className="relative z-10 text-2xl sm:text-4xl md:text-5xl font-extrabold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-yellow-200 via-white to-pink-100"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
        >
          A Startup Management System
        </motion.p>

        <motion.p
          className="relative z-10 text-sm sm:text-base md:text-lg max-w-2xl mb-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          The ultimate toolkit to plan, pitch, track, and fund your startup — all in one platform.
        </motion.p>

        <motion.button
          onClick={scrollToAbout}
          className="relative z-10 bg-white text-[#FF6B1A] font-semibold text-base sm:text-lg px-6 py-3 sm:px-8 sm:py-4 rounded-full shadow-lg hover:scale-105 transition"
          whileTap={{ scale: 0.95 }}
        >
          Explore More
        </motion.button>
      </section>


    {/* About Section */}
      <section id="about" className="py-12 sm:py-16 md:py-24 px-4 sm:px-6 bg-[#FDF6F2]">
        <h2 className="text-3xl sm:text-4xl font-bold text-center mb-10 sm:mb-12 bg-gradient-to-r from-[#FF6B1A] to-[#FF8533] bg-clip-text text-transparent">
          Why Choose Us?
        </h2>
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-8 md:gap-12 items-center">
          {/* Text */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="flex-1 text-base sm:text-lg text-gray-800"
          >
            <p>
              We help startup founders stay organized, pitch confidently, and attract funding faster.
            </p>
            <ul className="mt-6 list-disc pl-5 space-y-2 text-sm sm:text-base">
              <li>🚀 Streamlined task planning & tracking</li>
              <li>📊 Investor-ready pitch deck management</li>
              <li>🤝 Cap table transparency for stakeholders</li>
            </ul>
          </motion.div>

          {/* Animation */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="flex-1 flex justify-center"
          >
            <Lottie animationData={aboutAnimation} loop style={{ width: "100%", maxWidth: "320px" }} />
          </motion.div>
        </div>
      </section>

      {/* Key Features Cards */}
      <section id="features" className="py-12 sm:py-16 md:py-20 bg-gradient-to-br from-[#0D2A4D] via-[#0B1E35] to-[#FF6B1A] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold mb-8 sm:mb-10">⚡ Key Features</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {features.map((f, idx) => (
              <div
                key={idx}
                className="bg-white/10 backdrop-blur-md p-5 sm:p-6 rounded-xl shadow-lg hover:scale-105 transition"
              >
                <h3 className="text-lg sm:text-xl font-semibold mb-2">{f.title}</h3>
                <p className="text-gray-200 text-sm sm:text-base">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features with Charts */}
      <section className="py-12 sm:py-16 md:py-20 bg-[#FDF6F2]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-16 md:space-y-20">
          
          {/* Pitch Deck Analyzer */}
          <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold mb-3 text-gray-800">📊 Pitch Deck Analyzer</h2>
              <p className="text-gray-600 mb-3 text-sm sm:text-base">
                Our AI analyzes your pitch, identifies issues like incorrect data, lack of appeal, and poor structure.
              </p>
              <ul className="list-disc list-inside text-gray-600 text-sm sm:text-base">
                <li>Detects mistakes</li>
                <li>Improves presentation appeal</li>
                <li>Boosts investor confidence</li>
              </ul>
            </div>
            <div className="w-full max-w-xs mx-auto text-center">
              <PieChart data={pitchDeckData} />
              <p className="text-xs sm:text-sm text-gray-500 mt-2">* Most pitch decks fail without improvements.</p>
            </div>
          </div>

          {/* Task Assignment */}
          <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center md:flex-row-reverse">
            <div className="w-full max-w-xs mx-auto text-center">
              <BarChart data={taskData} />
              <p className="text-xs sm:text-sm text-gray-500 mt-2">* Tasks remain unassigned without smart allocation.</p>
            </div>
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold mb-3 text-gray-800">✅ Smart Task Assignment</h2>
              <p className="text-gray-600 mb-3 text-sm sm:text-base">
                Assigns employees the right tasks based on skill & workload, boosting productivity.
              </p>
              <ul className="list-disc list-inside text-gray-600 text-sm sm:text-base">
                <li>Easy and efficient</li>
                <li>Boosts productivity</li>
                <li>Reduces management workload</li>
              </ul>
            </div>
          </div>

          {/* Funding Advisor */}
          <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold mb-3 text-gray-800">💰 AI Funding Advisor</h2>
              <p className="text-gray-600 mb-3 text-sm sm:text-base">
                Identifies best investors, predicts chances of success, and prepares funding strategy.
              </p>
              <ul className="list-disc list-inside text-gray-600 text-sm sm:text-base">
                <li>Suggests investors</li>
                <li>Predicts funding probability</li>
                <li>Optimizes fundraising</li>
              </ul>
            </div>
            <div className="w-full max-w-xs mx-auto text-center">
              <PieChart data={fundingData} />
              <p className="text-xs sm:text-sm text-gray-500 mt-2">* Funding chances drop drastically without strategy.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Reviews Section */}
      <section id="review" className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 bg-gradient-to-br from-[#0D2A4D] via-[#0B1E35] to-[#FF6B1A]">
        <h2 className="text-3xl sm:text-4xl font-bold text-center mb-10 sm:mb-14 text-[#FF6B1A]">
          What Our Users Say
        </h2>
        <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {[
            { name: "Aarav Sharma", role: "Founder", rating: 5, review: "Startify made it so much easier to organize my team and prepare pitches." },
            { name: "Priya Nair", role: "Entrepreneur", rating: 4, review: "The cap table tracker is a lifesaver. Needs more integrations, but great!" },
            { name: "Rohan Patel", role: "Investor", rating: 5, review: "Finally, a tool that keeps startups investor-ready. Love the UI!" },
          ].map((t, i) => (
            <motion.div
              key={i}
              className="p-6 sm:p-8 bg-[#FDF6F2] rounded-xl shadow hover:shadow-lg transition border border-[#FFD6B3]"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <div className="flex items-center mb-3">
                {[...Array(t.rating)].map((_, idx) => (
                  <span key={idx} className="text-yellow-400 text-lg sm:text-xl">★</span>
                ))}
                {[...Array(5 - t.rating)].map((_, idx) => (
                  <span key={idx} className="text-gray-300 text-lg sm:text-xl">★</span>
                ))}
              </div>
              <p className="text-gray-700 mb-3 text-sm sm:text-base">“{t.review}”</p>
              <h3 className="font-bold text-[#FF6B1A]">{t.name}</h3>
              <p className="text-xs sm:text-sm text-gray-500">{t.role}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 bg-[#FDF6F2]">
        <h2 className="text-3xl sm:text-4xl font-bold text-center mb-8 sm:mb-10 text-[#FF6B1A]">FAQ</h2>
        <div className="max-w-3xl mx-auto space-y-4">
          {[
            { q: "What is StartupMS?", a: "It’s an all-in-one management system for startups." },
            { q: "Is there a free plan?", a: "Yes! We offer a free Starter plan." },
            { q: "Can I upgrade anytime?", a: "Absolutely, you can upgrade whenever you need." },
          ].map((faq, i) => (
            <motion.div
              key={i}
              className="bg-white p-5 sm:p-6 rounded-lg shadow cursor-pointer border border-[#FFD6B3]"
              onClick={() => toggleFAQ(i)}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <div className="flex justify-between items-center">
                <h3 className="text-base sm:text-lg font-semibold">{faq.q}</h3>
                <ChevronDown className={`transition-transform ${openFAQ === i ? "rotate-180" : "rotate-0"}`} />
              </div>
              {openFAQ === i && (
                <motion.p
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  transition={{ duration: 0.3 }}
                  className="mt-2 text-gray-700 text-sm sm:text-base"
                >
                  {faq.a}
                </motion.p>
              )}
            </motion.div>
          ))}
        </div>
      </section>

{/* Startups in India Graph */}
<section className="py-12 sm:py-16 md:py-20 bg-[#FDF6F2]">
  <div className="max-w-6xl mx-auto px-4 sm:px-6 text-center">
    <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-[#FF6B1A]">
      Growth of Startups in India 🚀
    </h2>
    <p className="text-gray-600 mb-8 text-sm sm:text-base">
      The Indian startup ecosystem has been growing rapidly over the last decade.
    </p>
    <div className="w-full max-w-3xl mx-auto">
      <StartupsGraph />
    </div>
  </div>
</section>

      {/* Footer CTA */}
      <footer id="get-started" className="bg-gradient-to-r from-[#0D2A4D] via-[#0B1E35] to-[#FF6B1A] text-white py-16 sm:py-20 text-center relative">
        <motion.h2
          className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          Ready to Scale Your Startup?
        </motion.h2>
        <motion.a
          href="./register"
          className="inline-block bg-white text-[#FF6B1A] px-6 py-3 sm:px-8 sm:py-4 rounded-full shadow-lg text-base sm:text-lg font-semibold hover:bg-gray-200 hover:scale-105 transition"
          whileTap={{ scale: 0.95 }}
        >
          Get Started Now
        </motion.a>
        <p className="mt-6 sm:mt-8 text-xs sm:text-sm text-orange-100">
          &copy; {new Date().getFullYear()} Startify. All rights reserved.
        </p>
      </footer>
    </main>
  );
}
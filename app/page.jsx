"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import Lottie from "lottie-react";
import { Menu, X, ChevronDown } from "lucide-react";
import StartupsGraph from "@/components/StartupsGraph";
// Import Lottie animations
import heroAnimation from "./animations/Hero.json";
import aboutAnimation from "./animations/about.json";
import { scroller } from "react-scroll";

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
// import { Menu, X } from "lucide-react";

import { Link } from "react-scroll"; // 👈 smooth scroll

export default function LandingPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [openFAQ, setOpenFAQ] = useState(null);

  const toggleFAQ = (index) => {
    setOpenFAQ(openFAQ === index ? null : index);
  };

 // Example Data
  const pitchDeckData = {
    labels: ["Failed", "Incorrect", "Unattractive"],
    datasets: [
      {
        data: [40, 35, 25], // Example values
        backgroundColor: ["#EF4444", "#F59E0B", "#3B82F6"],
      },
    ],
  };

  const taskData = {
    labels: ["Assigned", "Unassigned"],
    datasets: [
      {
        label: "Tasks",
        data: [75, 25],
        backgroundColor: ["#10B981", "#9CA3AF"],
      },
    ],
  };

  const fundingData = {
    labels: ["Success", "Rejected"],
    datasets: [
      {
        data: [60, 40],
        backgroundColor: ["#22C55E", "#EF4444"],
      },
    ],
  };
    

  // features card data
    const features = [
    {
      title: "📊 Pitch Deck Analyzer",
      desc: "AI detects mistakes, improves design, and boosts investor confidence.",
    },
    {
      title: "✅ Smart Task Assignment",
      desc: "Automatically assigns tasks to the right employees based on skills.",
    },
    {
      title: "💰 AI Funding Advisor",
      desc: "Finds investors, predicts funding success, and builds strategy.",
    },
    {
      title: "📈 Efficient Employee Management",
      desc: "Track and manage Employee efficiently.",
    },
  ];



  const links = [
    { label: "Home", to: "home" },
    { label: "About", to: "about" },
    { label: "Features", to: "features" },
    { label: "Review", to: "review" },
    { label: "FAQ", to: "faq" },
  ];

const scrollToAbout = () => {
  scroller.scrollTo("about", {
    duration: 3200,      // precise duration in ms
    delay: 0,
    smooth: "easeInOut" // smooth animation style
  });
};

const scrollToGetStarted = () => {
  scroller.scrollTo("get-started", {
    duration: 2900,       // precise scroll duration in ms
    delay: 0,
    smooth: "easeInOut"  // smooth animation
  });
};

  return (
    <main className="bg-white text-gray-900 scroll-smooth">
      {/* Navbar */}
    <header className="fixed w-full bg-white/70 backdrop-blur-md shadow z-50 px-6 py-3 flex justify-between items-center h-16">
        {/* Logo */}
        <div className="h-full flex items-center">
          <img
            src="/logowb.png"
            alt="Startify Logo"
            className="h-35 w-auto object-contain"
          />
        </div>

        {/* Desktop Menu */}
        <nav className="hidden md:flex gap-8 text-gray-700 font-medium">
          {links.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              smooth={true}
              duration={1200} // 👈 1.2s smooth scroll
              offset={-70} // adjust for fixed navbar
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
          className="md:hidden text-3xl text-[#FF6B1A]"
        >
          {isMenuOpen ? <X /> : <Menu />}
        </button>

        {/* Get Started */}
       <motion.button
  onClick={scrollToGetStarted}
  className="hidden md:block bg-gradient-to-r from-[#FF6B1A] to-[#FF8533] text-white px-5 py-2 rounded-full shadow hover:shadow-xl hover:scale-105 transition transform"
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
              smooth={true}
              duration={1200}
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
  <section id="home" className="relative min-h-screen bg-gradient-to-br from-[#0D2A4D] via-[#0B1E35] to-[#FF6B1A] flex flex-col justify-center items-center text-center px-8 pt-32 text-white overflow-hidden">
  {/* Hero Animation Background */}
  <div className="absolute inset-0 flex justify-center items-center opacity-25 pointer-events-none">
    <Lottie animationData={heroAnimation} loop={true} style={{ width: "95%", height: "95%" }} />
  </div>

  {/* Hero Content */}
  <motion.h1
    className="transform -translate-y-30 relative z-10 text-5xl md:text-7xl font-extrabold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-yellow-200 via-white to-pink-100"
    initial={{ opacity: 0, y: 50 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.8 }}
    whileHover={{ scale: 1.05 }}
  >
    Startify
  </motion.h1>

  <motion.p
    className="transform -translate-y-30 relative z-10 text-lg md:text-xl max-w-3xl mb-3"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ delay: 0.5, duration: 0.8 }}
  >
    "Where Startups Get Started"
  </motion.p>

  {/* New Sub-Tagline */}
  <motion.p
className="relative z-10 text-4xl md:text-6xl font-extrabold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-yellow-200 via-white to-pink-100"
    initial={{ opacity: 0, y: 50 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.8 }}
    whileHover={{ scale: 1.05 }}
  >
   A Startup Management System 
  </motion.p>

  <motion.p
    className="relative z-10 text-lg md:text-xl max-w-3xl mb-3"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ delay: 0.5, duration: 0.8 }}
  >
   The ultimate toolkit to plan, pitch, track, and fund your startup — all in one modern platform.
  </motion.p>
<br />
  <motion.button
  onClick={scrollToAbout}
  className="relative z-10 bg-white text-[#FF6B1A] font-semibold text-lg px-8 py-4 rounded-full shadow-lg hover:shadow-2xl hover:scale-110 transition transform"
  whileTap={{ scale: 0.95 }}
>
  Explore More
</motion.button>
</section>


      {/* About Section */}
      <section id="about" className="py-24 px-6 bg-[#FDF6F2]">
        <h2 className="text-4xl font-bold text-center mb-12 bg-gradient-to-r from-[#FF6B1A] to-[#FF8533] bg-clip-text text-transparent">
          Why Choose Us?
        </h2>
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="flex-1 text-lg leading-relaxed text-gray-800"
          >
            <p>
              We help startup founders stay organized, pitch confidently, and attract funding faster. Our system is built for speed and simplicity, so you can focus on what really matters — growing your business.
            </p>
            <ul className="mt-6 list-disc pl-6 space-y-2">
              <li>🚀 Streamlined task planning & progress tracking</li>
              <li>📊 Investor-ready pitch deck management</li>
              <li>🤝 Cap table transparency for all stakeholders</li>
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="flex-1 flex justify-center"
          >
            <Lottie animationData={aboutAnimation} loop={true} style={{ width: "100%", maxWidth: "400px" }} />
          </motion.div>
        </div>
      </section>

      {/* features cards */}
          <section id="features" className="py-16 bg-gradient-to-br from-[#0D2A4D] via-[#0B1E35] to-[#FF6B1A] text-white">
      <div className="max-w-7xl mx-auto px-6 text-center">
        <h2 className="text-3xl font-bold mb-10">⚡ Key Features</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((f, idx) => (
            <div
              key={idx}
              className="bg-white/10 backdrop-blur-md p-6 rounded-xl shadow-lg hover:scale-105 transition-transform duration-300"
            >
              <h3 className="text-xl font-semibold mb-3">{f.title}</h3>
              <p className="text-gray-200 text-sm">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>

      {/* Features Section */}
      <section className="py-20 bg-[#FDF6F2]">
      <div className="max-w-7xl mx-auto px-6 space-y-20">
        
        {/* Feature 1 - Pitch Deck Analyzer */}
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold mb-4 text-gray-800">
              📊 AI-Powered Pitch Deck Analyzer
            </h2>
            <p className="text-gray-600 mb-4">
              Most startups struggle with weak pitch decks. Our AI analyzes your
              pitch, identifies issues like incorrect data, lack of appeal, and
              poor structure — then suggests improvements to make it investor-ready.
            </p>
            <ul className="list-disc list-inside text-gray-600">
              <li>Detects mistakes automatically</li>
              <li>Improves presentation appeal</li>
              <li>Boosts investor confidence</li>
            </ul>
          </div>
          <div className="w-72 h-80 mx-auto text-center">
            <PieChart data={pitchDeckData} />
            <p className="text-sm text-gray-500 mt-2">* Without our feature, most pitch decks fail to attract investors.</p>
          </div>
        </div>

        {/* Feature 2 - Task Assignment */}
        <div className="grid md:grid-cols-2 gap-12 items-center md:flex-row-reverse">
          <div className="w-80 h-80 mx-auto text-center">
            <BarChart data={taskData} />
            <p className="text-sm text-gray-500 mt-2">* Without our feature, tasks remain unassigned and productivity drops.</p>
          </div>
          <div>
            <h2 className="text-3xl font-bold mb-4 text-gray-800">
              ✅ Smart Task Assignment
            </h2>
            <p className="text-gray-600 mb-4">
              Assigning tasks manually wastes time. Our system automatically
              assigns employees the right tasks based on skill & workload, so
              nothing falls through the cracks.
            </p>
            <ul className="list-disc list-inside text-gray-600">
              <li>AI-based employee matching</li>
              <li>Boosts productivity</li>
              <li>Reduces management workload</li>
            </ul>
          </div>
        </div>

        {/* Feature 3 - AI Funding Advisor */}
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold mb-4 text-gray-800">
              💰 AI Funding Advisor
            </h2>
            <p className="text-gray-600 mb-4">
              Funding is the lifeline of startups. Our AI funding advisor helps
              identify the best investors, predicts chances of success, and
              prepares your funding timeline.
            </p>
            <ul className="list-disc list-inside text-gray-600">
              <li>Suggests potential investors</li>
              <li>Predicts funding probability</li>
              <li>Optimizes fundraising strategy</li>
            </ul>
          </div>
          <div className="w-72 h-80 mx-auto text-center">
            <PieChart data={fundingData} />
            <p className="text-sm text-gray-500 mt-2">* Without our feature, funding chances decrease drastically.</p>
          </div>
        </div>
      </div>
    </section>

      {/* Reviews Section */}
      <section id="review" className="py-18 px-6 bg-gradient-to-br from-[#0D2A4D] via-[#0B1E35] to-[#FF6B1A]">
        <h2 className="text-4xl font-bold text-center mb-14 text-[#FF6B1A]">
          What Our Users Say
        </h2>

        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {[
            {
              name: "Aarav Sharma",
              role: "Startup Founder",
              rating: 5,
              review: "Startify made it so much easier to organize my team and prepare investor pitches. Highly recommend!",
            },
            {
              name: "Priya Nair",
              role: "Entrepreneur",
              rating: 4,
              review: "The cap table tracker is a lifesaver. Could use more integrations, but overall amazing platform!",
            },
            {
              name: "Rohan Patel",
              role: "Investor",
              rating: 5,
              review: "Finally, a tool that helps startups stay investor-ready. Clean UI and great functionality!",
            },
          ].map((testimonial, i) => (
            <motion.div
              key={i}
              className="p-8 bg-[#FDF6F2] rounded-2xl shadow hover:shadow-xl transition border border-[#FFD6B3]"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.2 }}
            >
              <div className="flex items-center mb-4">
                {[...Array(testimonial.rating)].map((_, idx) => (
                  <span key={idx} className="text-yellow-400 text-xl">★</span>
                ))}
                {[...Array(5 - testimonial.rating)].map((_, idx) => (
                  <span key={idx} className="text-gray-300 text-xl">★</span>
                ))}
              </div>
              <p className="text-gray-700 mb-4">“{testimonial.review}”</p>
              <h3 className="font-bold text-[#FF6B1A]">{testimonial.name}</h3>
              <p className="text-sm text-gray-500">{testimonial.role}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Startups Graph Section */}

      <div className="pb-18 bg-[#FDF6F2]"><StartupsGraph /></div>

{/* FAQ Section */}
      <section id="faq" className="py-24 px-6 bg-[#FDF6F2]">
        <h2 className="text-4xl font-bold text-center mb-10 text-[#FF6B1A]">FAQ</h2>
        <div className="max-w-4xl mx-auto space-y-4">
          {[
            { q: "What is StartupMS?", a: "It’s an all-in-one management system for startups." },
            { q: "Is there a free plan?", a: "Yes! We offer a free Starter plan." },
            { q: "Can I upgrade anytime?", a: "Absolutely, you can upgrade whenever you need." },
          ].map((faq, i) => (
            <motion.div
              key={i}
              className="bg-white p-6 rounded-lg shadow cursor-pointer border border-[#FFD6B3]"
              onClick={() => toggleFAQ(i)}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">{faq.q}</h3>
                <ChevronDown
                  className={`transition-transform ${openFAQ === i ? "rotate-180" : "rotate-0"}`}
                />
              </div>
              {openFAQ === i && (
                <motion.p
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  transition={{ duration: 0.3 }}
                  className="mt-2 text-gray-700"
                >
                  {faq.a}
                </motion.p>
              )}
            </motion.div>
          ))}
        </div>
      </section>

      {/* Footer CTA */}
      <footer
        id="get-started"
        className="bg-gradient-to-r from-[#0D2A4D] via-[#0B1E35] to-[#FF6B1A] text-white py-20 text-center relative overflow-hidden"
      >
        <motion.h2
          className="text-4xl font-bold mb-6"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          Ready to Scale Your Startup?
        </motion.h2>
        <br />
        <motion.a
          href="./register"
          className="bg-white text-[#FF6B1A] px-10 py-5 rounded-full shadow-lg text-xl font-semibold hover:bg-gray-200 hover:scale-110 transition"
          whileTap={{ scale: 0.95 }}
        >
          Get Started Now
        </motion.a>
        <br />
        <br />

        <p className="mt-8 text-orange-100">
          &copy; {new Date().getFullYear()} Startify. All rights reserved.
        </p>
      </footer>
    </main>
  );
}

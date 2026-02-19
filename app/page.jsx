"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { scroller, Link as ScrollLink } from "react-scroll";
import Link from "next/link";
import Lottie from "lottie-react";
import { 
  Menu, X, ChevronDown, ArrowRight, CheckCircle, 
  BarChart3, Zap, ShieldCheck, PieChart as PieIcon 
} from "lucide-react";
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

// Components & Animations
import StartupsGraph from "@/components/StartupsGraph";
import heroAnimation from "./animations/Hero.json";
import aboutAnimation from "./animations/about.json";

// Register Charts
ChartJS.register(Title, Tooltip, Legend, ArcElement, CategoryScale, LinearScale, BarElement);

export default function LandingPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [openFAQ, setOpenFAQ] = useState(null);
  const [scrolled, setScrolled] = useState(false);

  // Handle Navbar Scroll Effect
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleFAQ = (index) => setOpenFAQ(openFAQ === index ? null : index);

  // --- DATA ---
  const pitchDeckData = {
    labels: ["Failed", "Incorrect", "Unattractive"],
    datasets: [{ data: [40, 35, 25], backgroundColor: ["#EF4444", "#F59E0B", "#3B82F6"] }],
  };
  const taskData = {
    labels: ["Assigned", "Unassigned"],
    datasets: [{ label: "Tasks", data: [75, 25], backgroundColor: ["#10B981", "#9CA3AF"] }],
  };
  const fundingData = {
    labels: ["Success", "Rejected"],
    datasets: [{ data: [60, 40], backgroundColor: ["#22C55E", "#EF4444"] }],
  };

  const navLinks = [
    { label: "Home", to: "home" },
    { label: "About", to: "about" },
    { label: "Features", to: "features" },
    { label: "Reviews", to: "reviews" },
    { label: "FAQ", to: "faq" },
  ];

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 overflow-x-hidden relative">
      
   {/* Background Texture Overlay */}
      <div 
        // 1. Removed 'mix-blend-overlay'
        // 2. Set opacity to a very low specific number (5%)
        // 3. Added 'grayscale' to ensure no weird colors appear
        className="absolute inset-0 z-0 opacity-[0.2] grayscale pointer-events-none bg-repeat" 
        
        // MAKE SURE THIS FILENAME IS CORRECT
        style={{ backgroundImage: `url('/bg3.jpg')` }} 
      >
      </div>
      {/* --- NAVBAR --- */}
      <nav className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? "bg-white/90 backdrop-blur-md shadow-sm border-b border-gray-100 py-3" : "bg-transparent py-5"}`}>
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
          
          {/* Logo */}
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => scroller.scrollTo("home", { smooth: true })}>
             <img src="/logowb.png" alt="Startify Logo" className="h-[110px] w-auto -my-[30px]" />
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-12">
            {navLinks.map((link) => (
              <ScrollLink
                key={link.to}
                to={link.to}
                smooth={true}
                duration={800}
                offset={-80}
                className="text-sm font-bold text-slate-800 hover:text-[#FF6B1A] cursor-pointer transition-colors"
              >
                {link.label}
              </ScrollLink>
            ))}
          </div>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center gap-4">
            <Link href="/register" className="bg-[#FF6B1A] hover:bg-[#e05a15] text-white px-6 py-3 rounded-full text-base font-semibold transition shadow-lg shadow-orange-200">
              Get Started
            </Link>
          </div>

          {/* Mobile Toggle */}
          <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="md:hidden text-slate-700">
            {isMenuOpen ? <X /> : <Menu />}
          </button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }} 
              animate={{ height: "auto", opacity: 1 }} 
              exit={{ height: 0, opacity: 0 }}
              className="md:hidden bg-white border-b border-gray-100 overflow-hidden"
            >
              <div className="flex flex-col p-6 gap-4">
                {navLinks.map((link) => (
                  <ScrollLink
                    key={link.to}
                    to={link.to}
                    smooth={true}
                    offset={-70}
                    onClick={() => setIsMenuOpen(false)}
                    className="text-slate-700 font-medium py-2 border-b border-gray-50"
                  >
                    {link.label}
                  </ScrollLink>
                ))}
                <Link href="/register" className="bg-[#FF6B1A] text-white text-center py-3 rounded-xl font-semibold mt-2">
                  Join Now
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* --- HERO SECTION --- */}
      <section id="home" className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 px-6 bg-transparent">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center relative z-10">
          
          {/* Left Content */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }} 
            animate={{ opacity: 1, x: 0 }} 
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-50 border border-orange-100 text-[#FF6B1A] text-xs font-bold mb-6 uppercase tracking-wider">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#FF6B1A]"></span>
              </span>
              Startup Management System
            </div>
            
            <h1 className="text-5xl lg:text-7xl font-bold text-slate-900 leading-[1.1] mb-6">
              Where Startups <br/>
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#FF6B1A] to-[#FF9E1B]">Get Started</span>
            </h1>
            
            <p className="text-lg text-slate-600 mb-8 leading-relaxed max-w-lg">
              The ultimate toolkit to plan, pitch, track, and fund your startup. From idea to IPO, we've got you covered.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/register" className="flex items-center justify-center gap-2 bg-[#FF6B1A] text-white px-8 py-4 rounded-xl font-semibold hover:bg-[#e05a15] transition shadow-xl shadow-orange-200">
                Start for Free <ArrowRight className="w-5 h-5" />
              </Link>
              <ScrollLink to="about" smooth={true} offset={-80} className="flex items-center justify-center gap-2 bg-white text-slate-700 border border-gray-200 px-8 py-4 rounded-xl font-semibold hover:bg-gray-50 transition cursor-pointer">
                Explore Features
              </ScrollLink>
            </div>
            
            <div className="mt-10 flex items-center gap-6 text-sm text-slate-500 font-medium">
              <div className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-500" /> Free Plan Available</div>
              <div className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-500" /> No Credit Card Required</div>
            </div>
          </motion.div>

          {/* Right Animation */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }} 
            animate={{ opacity: 1, scale: 1 }} 
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <div className="relative z-10">
               <Lottie animationData={heroAnimation} className="w-full h-auto max-w-[600px] mx-auto" />
            </div>
            {/* Background Blob */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-gradient-to-tr from-orange-100/50 to-blue-100/50 rounded-full blur-3xl -z-10"></div>
          </motion.div>
        </div>
      </section>

      {/* --- ABOUT SECTION --- */}
      <section id="about" className="py-24 bg-white relative z-10">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-16 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -30 }} 
            whileInView={{ opacity: 1, x: 0 }} 
            viewport={{ once: true }}
            className="order-2 md:order-1"
          >
            <Lottie animationData={aboutAnimation} className="w-full max-w-md mx-auto" />
          </motion.div>
          
          <motion.div 
             initial={{ opacity: 0, x: 30 }} 
             whileInView={{ opacity: 1, x: 0 }} 
             viewport={{ once: true }}
             className="order-1 md:order-2"
          >
            <h2 className="text-sm font-bold text-[#FF6B1A] uppercase tracking-wide mb-2">Why Choose Us?</h2>
            <h3 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">Streamline your journey from concept to launch.</h3>
            <p className="text-slate-600 text-lg mb-8 leading-relaxed">
              We help startup founders stay organized, pitch confidently, and attract funding faster. Stop juggling multiple tools and focus on building.
            </p>
            
            <div className="space-y-4">
              {[
                "🚀 Streamlined task planning & tracking",
                "📊 Investor-ready pitch deck management",
                "🤝 Cap table transparency for stakeholders"
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3 p-4 rounded-xl bg-slate-50 border border-slate-100">
                  <CheckCircle className="w-5 h-5 text-green-500 shrink-0" />
                  <span className="font-medium text-slate-800">{item.slice(2)}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* --- FEATURES GRID --- */}
      <section id="features" className="py-24 bg-slate-50 relative z-10">
        <div className="max-w-7xl mx-auto px-6 text-center mb-16">
          <h2 className="text-3xl font-bold text-slate-900">Everything you need to scale</h2>
          <p className="text-slate-500 mt-4 max-w-2xl mx-auto">Powerful tools integrated into one seamless workflow to help you succeed.</p>
        </div>

        <div className="max-w-7xl mx-auto px-6 grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { title: "Pitch Deck Analyzer", icon: <BarChart3 className="w-6 h-6 text-blue-600" />, desc: "AI detects mistakes, improves design, and boosts investor confidence." },
            { title: "Smart Task Assignment", icon: <Zap className="w-6 h-6 text-yellow-500" />, desc: "Assigns tasks to the right employees based on skills automatically." },
            { title: "AI Funding Advisor", icon: <PieIcon className="w-6 h-6 text-green-600" />, desc: "Finds investors, predicts funding success, and builds strategy." },
            { title: "Employee Management", icon: <ShieldCheck className="w-6 h-6 text-purple-600" />, desc: "Track and manage employees efficiently with comprehensive logs." },
          ].map((feature, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
              className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
            >
              <div className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center mb-6">
                {feature.icon}
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-3">{feature.title}</h3>
              <p className="text-slate-500 text-sm leading-relaxed">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* --- DATA VISUALIZATION SECTION --- */}
      <section className="py-24 bg-white overflow-hidden relative z-10">
        <div className="max-w-7xl mx-auto px-6 space-y-24">
          
          {/* Pitch Deck Feature */}
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="relative">
              <div className="absolute inset-0 bg-blue-100 rounded-full filter blur-3xl opacity-30"></div>
              <div className="relative bg-white p-6 rounded-2xl shadow-2xl border border-gray-100 max-w-sm mx-auto">
                <PieChart data={pitchDeckData} />
                <p className="text-xs text-center text-slate-400 mt-4 italic">* Without Startify, 40% of decks fail.</p>
              </div>
            </div>
            <div>
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600 mb-6"><BarChart3 /></div>
              <h2 className="text-3xl font-bold text-slate-900 mb-4">Analyze your Pitch Deck with AI</h2>
              <p className="text-slate-600 mb-6">Don't let a bad slide ruin your funding chance. Our AI scans your deck for common pitfalls like incorrect data or poor structure.</p>
              <ul className="space-y-3">
                <li className="flex gap-3 text-slate-700"><CheckCircle className="w-5 h-5 text-blue-500" /> Real-time error detection</li>
                <li className="flex gap-3 text-slate-700"><CheckCircle className="w-5 h-5 text-blue-500" /> Structure recommendations</li>
              </ul>
            </div>
          </div>

          {/* Task Feature */}
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="order-2 md:order-1">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center text-green-600 mb-6"><Zap /></div>
              <h2 className="text-3xl font-bold text-slate-900 mb-4">Automate Task Assignment</h2>
              <p className="text-slate-600 mb-6">Stop micromanaging. Startify intelligently assigns tasks to team members based on their current workload and skill set.</p>
              <ul className="space-y-3">
                <li className="flex gap-3 text-slate-700"><CheckCircle className="w-5 h-5 text-green-500" /> Load balancing</li>
                <li className="flex gap-3 text-slate-700"><CheckCircle className="w-5 h-5 text-green-500" /> Skill matching</li>
              </ul>
            </div>
            <div className="order-1 md:order-2 relative">
               <div className="absolute inset-0 bg-green-100 rounded-full filter blur-3xl opacity-30"></div>
               <div className="relative bg-white p-6 rounded-2xl shadow-2xl border border-gray-100 max-w-sm mx-auto">
                <BarChart data={taskData} />
              </div>
            </div>
          </div>

           {/* Funding Feature */}
           <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="relative">
              <div className="absolute inset-0 bg-orange-100 rounded-full filter blur-3xl opacity-30"></div>
              <div className="relative bg-white p-6 rounded-2xl shadow-2xl border border-gray-100 max-w-sm mx-auto">
                <PieChart data={fundingData} />
              </div>
            </div>
            <div>
              <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center text-orange-600 mb-6"><PieIcon /></div>
              <h2 className="text-3xl font-bold text-slate-900 mb-4">Secure Funding Faster</h2>
              <p className="text-slate-600 mb-6">Our AI Advisor identifies the best investors for your niche and predicts your funding probability before you even pitch.</p>
              <ul className="space-y-3">
                 <li className="flex gap-3 text-slate-700"><CheckCircle className="w-5 h-5 text-orange-500" /> Investor matching</li>
                 <li className="flex gap-3 text-slate-700"><CheckCircle className="w-5 h-5 text-orange-500" /> Success probability score</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* --- MARKET GRAPH SECTION --- */}
      <section className="py-24 bg-slate-900 text-white relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-[url('/globe.svg')] opacity-10 bg-no-repeat bg-center bg-cover"></div>
        <div className="max-w-6xl mx-auto px-6 text-center relative z-10">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Growth of Startups in India 🚀
          </h2>
          <p className="text-slate-400 mb-12 max-w-2xl mx-auto">
            The Indian startup ecosystem has been growing rapidly. See how the landscape has evolved over the last decade.
          </p>
          <div className="bg-slate-800/50 backdrop-blur-sm p-6 rounded-3xl border border-slate-700">
             <StartupsGraph />
          </div>
        </div>
      </section>

      {/* --- REVIEWS --- */}
      <section id="reviews" className="py-24 bg-slate-50 relative z-10">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center text-slate-900 mb-16">Trusted by Founders</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { name: "Aarav Sharma", role: "Founder, TechFlow", text: "Startify made it so much easier to organize my team and prepare pitches. Highly recommended!", rating: 5 },
              { name: "Priya Nair", role: "Entrepreneur", text: "The cap table tracker is a lifesaver. Finally, a tool that keeps startups investor-ready.", rating: 4 },
              { name: "Rohan Patel", role: "Angel Investor", text: "I recommend Startify to all my portfolio companies. It keeps their data clean and accessible.", rating: 5 },
            ].map((review, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 relative"
              >
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, r) => (
                    <span key={r} className={`text-xl ${r < review.rating ? "text-yellow-400" : "text-gray-200"}`}>★</span>
                  ))}
                </div>
                <p className="text-slate-600 mb-6 italic">"{review.text}"</p>
                <div>
                  <h4 className="font-bold text-slate-900">{review.name}</h4>
                  <p className="text-xs text-slate-500 uppercase font-semibold">{review.role}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* --- FAQ --- */}
      <section id="faq" className="py-24 bg-white relative z-10">
        <div className="max-w-3xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center text-slate-900 mb-12">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {[
              { q: "What is Startify?", a: "It’s an all-in-one management system designed to help startups plan, track tasks, and secure funding." },
              { q: "Is there a free plan?", a: "Yes! We offer a generous free Starter plan that includes basic task management and pitch analysis." },
              { q: "Can I upgrade anytime?", a: "Absolutely. You can scale your plan as your startup grows without any hidden fees." },
            ].map((item, i) => (
              <div key={i} className="border border-gray-200 rounded-xl overflow-hidden">
                <button 
                  onClick={() => toggleFAQ(i)}
                  className="w-full flex justify-between items-center p-6 bg-slate-50 hover:bg-slate-100 transition text-left"
                >
                  <span className="font-semibold text-slate-900">{item.q}</span>
                  <ChevronDown className={`w-5 h-5 text-slate-500 transition-transform ${openFAQ === i ? "rotate-180" : ""}`} />
                </button>
                <AnimatePresence>
                  {openFAQ === i && (
                    <motion.div 
                      initial={{ height: 0 }} 
                      animate={{ height: "auto" }} 
                      exit={{ height: 0 }} 
                      className="overflow-hidden bg-white"
                    >
                      <p className="p-6 text-slate-600 border-t border-gray-100">{item.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="bg-slate-900 text-white py-20 border-t border-slate-800 relative z-10">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Scale Your Startup?</h2>
          <p className="text-slate-400 mb-8 max-w-xl mx-auto">Join thousands of founders who are building the future with Startify.</p>
          <Link 
            href="/register" 
            className="inline-block bg-[#FF6B1A] hover:bg-[#e05a15] text-white px-8 py-4 rounded-full font-bold text-lg transition shadow-lg hover:shadow-orange-500/20 hover:-translate-y-1"
          >
            Get Started Now
          </Link>
          <div className="mt-16 pt-8 border-t border-slate-800 text-slate-500 text-sm">
            &copy; {new Date().getFullYear()} Startify. All rights reserved.
          </div>
        </div>
      </footer>

    </div>
  );
}
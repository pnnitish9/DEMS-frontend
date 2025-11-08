import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Calendar,
  Users,
  ShieldCheck,
  Menu,
  Moon,
  Sun,
  Quote,
  ArrowRight,
} from "lucide-react";
import { usePageContext } from "../context/PageContext";

export default function LandingPage() {
  const { navigate } = usePageContext();

  /* ✅ DARK MODE */
  const [dark, setDark] = useState(
    localStorage.getItem("theme") === "dark"
  );

  const toggleTheme = () => {
    const newTheme = !dark;
    setDark(newTheme);
    document.documentElement.classList.toggle("dark", newTheme);
    localStorage.setItem("theme", newTheme ? "dark" : "light");
  };

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
  }, []);

  /* ✅ Smooth Loop Typewriter */
  const words = [
    "Manage Events Effortlessly",
    "Track Registrations",
    "Scan QR Check-ins",
    "Organize Like a Pro",
  ];

  const [text, setText] = useState("");
  const [wIndex, setWIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const current = words[wIndex];
    const speed = deleting ? 40 : 80;

    const typer = setTimeout(() => {
      if (!deleting) {
        setText(current.substring(0, charIndex + 1));
        setCharIndex(charIndex + 1);

        if (charIndex === current.length) {
          setTimeout(() => setDeleting(true), 900);
        }
      } else {
        setText(current.substring(0, charIndex - 1));
        setCharIndex(charIndex - 1);

        if (charIndex === 0) {
          setDeleting(false);
          setWIndex((prev) => (prev + 1) % words.length);
        }
      }
    }, speed);

    return () => clearTimeout(typer);
  }, [charIndex, deleting, wIndex]);

  /* ✅ NAVBAR BLUR ON SCROLL */
  const [navBlur, setNavBlur] = useState(false);

  useEffect(() => {
    const handleScroll = () => setNavBlur(window.scrollY > 15);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="relative min-h-screen w-full bg-gradient-to-b from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-black dark:to-black text-gray-800 dark:text-gray-200">

      {/* ✅ FULL-WIDTH NAVBAR */}
        <motion.nav
          animate={{
            backdropFilter: navBlur ? "blur(14px)" : "blur(0px)",
            backgroundColor: navBlur
              ? "rgba(11, 66, 247, 0.25)"   // ✅ soft frosted glass
              : "rgba(48, 37, 37, 0.17)",     // ✅ completely transparent
          }}
          className="fixed top-0 left-0 w-full z-50 px-6 sm:px-10 md:px-16 py-4 flex justify-between items-center transition-all border-b border-transparent dark:border-transparent"
        >

        <h1 className="text-white font-extrabold text-2xl">
          <span className="text-indigo-500">DEMP</span> Portal
        </h1>

        <div className="flex items-center gap-6 text-white">
          <button
            onClick={() => navigate("login")}
            className="hidden md:block hover:text-indigo-400"
          >
            Login
          </button>

          <button
            onClick={() => navigate("register")}
            className="hidden md:block px-5 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow"
          >
            Get Started
          </button>

          <button
            onClick={toggleTheme}
            className="p-2 rounded-full bg-gray-800 text-yellow-400 shadow-md"
          >
            {dark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5 text-white" />}
          </button>

          <Menu className="md:hidden text-white w-7 h-7" />
        </div>
      </motion.nav>

      {/* ✅ BACKGROUND ANIMATIONS */}
      <BackgroundBlobs />

      {/* ✅ HERO (NO LEFT/RIGHT MARGINS → FULL WIDTH) */}
      <section className="w-full pt-40 pb-28 px-4 sm:px-10 md:px-16 grid lg:grid-cols-2 gap-16 items-center">

        {/* LEFT TEXT */}
        <motion.div initial={{ opacity: 0, x: -70 }} animate={{ opacity: 1, x: 0 }}>
          <h1 className="text-5xl md:text-6xl font-extrabold leading-tight text-gray-900 dark:text-white">
            {text}
            <span className="text-indigo-600">|</span>
          </h1>

          <p className="mt-6 text-lg max-w-xl text-gray-700 dark:text-gray-300">
            The all-in-one event management portal for colleges and communities.
          </p>

          <div className="mt-10 flex gap-4 flex-wrap">
            <motion.button
              onClick={() => navigate("register")}
              whileHover={{ scale: 1.05 }}
              className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg shadow"
            >
              Get Started
            </motion.button>

            <motion.button
              onClick={() => navigate("login")}
              whileHover={{ scale: 1.05 }}
              className="px-8 py-3 border border-gray-500 dark:border-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-800"
            >
              Login
            </motion.button>
          </div>
        </motion.div>

        {/* IMAGE */}
        <motion.img
          initial={{ opacity: 0, scale: 0.88 }}
          animate={{ opacity: 1, scale: 1 }}
          whileHover={{ scale: 1.03 }}
          transition={{ duration: 0.9 }}
          src="https://www.pingpongmoments.in/blog/wp-content/uploads/2022/09/corporate-events-3.jpg"
          className="w-full max-w-lg mx-auto rounded-2xl border-4 border-white dark:border-gray-800 shadow-xl shadow-indigo-300/40 dark:shadow-indigo-900/40"
          alt="Event Illustration"
        />

      </section>

      {/* ✅ SECTIONS (FULL WIDTH, NO LEFT/RIGHT MARGIN) */}
      <FeaturesSection />
      <TestimonialsSection />
      <CTASection navigate={navigate} />

      {/* ✅ FOOTER */}
      <footer className="py-6 text-center w-full text-gray-700 dark:text-gray-400">
        © {new Date().getFullYear()} DEMP — Digital Event Management Portal
      </footer>
    </div>
  );
}

/* ✅ BACKGROUND BLOBS */
function BackgroundBlobs() {
  return (
    <>
      <motion.div
        animate={{ x: [0, 50, -30, 0], y: [0, -30, 15, 0] }}
        transition={{ duration: 10, repeat: Infinity }}
        className="absolute w-96 h-96 bg-indigo-500/20 blur-3xl rounded-full -top-10 -left-10"
      />
      <motion.div
        animate={{ x: [0, -40, 20, 0], y: [0, 30, -10, 0] }}
        transition={{ duration: 12, repeat: Infinity }}
        className="absolute w-[28rem] h-[28rem] bg-purple-600/20 blur-3xl rounded-full bottom-0 right-0"
      />
    </>
  );
}

/* ✅ FEATURES */
function FeaturesSection() {
  const cards = [
    { icon: Calendar, title: "Easy Event Creation", desc: "Create events instantly." },
    { icon: Users, title: "Smart Registrations", desc: "Quick participant onboarding." },
    { icon: ShieldCheck, title: "Secure System", desc: "Powerful role-based access." },
  ];

  return (
    <section className="w-full py-20 bg-white dark:bg-gray-950 px-4 sm:px-10 md:px-16">
      <h2 className="text-4xl font-bold text-center">Why Choose DEMP?</h2>

      <div className="mt-14 grid md:grid-cols-3 gap-10 max-w-6xl mx-auto w-full">
        {cards.map((c, i) => (
          <FeatureCard key={i} icon={c.icon} title={c.title} desc={c.desc} />
        ))}
      </div>
    </section>
  );
}

function FeatureCard({ icon: Icon, title, desc }) {
  return (
    <motion.div
      whileHover={{ scale: 1.04, translateY: -4 }}
      className="text-center p-8 rounded-xl shadow-md bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 w-full"
    >
      <Icon className="w-12 h-12 mx-auto text-indigo-600 mb-4" />
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-600 dark:text-gray-300">{desc}</p>
    </motion.div>
  );
}

/* ✅ TESTIMONIALS */
function TestimonialsSection() {
  const people = [
    { img: "https://randomuser.me/api/portraits/men/32.jpg", name: "Amit Sharma", text: "DEMP improved our event flow." },
    { img: "https://randomuser.me/api/portraits/women/44.jpg", name: "Riya Patel", text: "The organizer tools are powerful!" },
    { img: "https://randomuser.me/api/portraits/men/76.jpg", name: "Manish Kumar", text: "QR check-in is lightning fast." },
  ];

  return (
    <section className="w-full py-24 bg-gray-50 dark:bg-gray-800 px-4 sm:px-10 md:px-16">
      <h2 className="text-4xl font-bold text-center mb-14">Loved by Students & Organizers</h2>

      <div className="grid md:grid-cols-3 gap-10 max-w-6xl mx-auto w-full">
        {people.map((p, i) => (
          <Testimonial key={i} img={p.img} name={p.name} text={p.text} />
        ))}
      </div>
    </section>
  );
}

function Testimonial({ img, name, text }) {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      className="p-6 bg-white dark:bg-gray-900 shadow-xl rounded-xl text-center border border-gray-200 dark:border-gray-800 w-full"
    >
      <img
        src={img}
        className="w-20 h-20 rounded-full mx-auto border-4 border-indigo-600 object-cover"
      />
      <Quote className="w-8 h-8 mx-auto text-indigo-600 mt-4 opacity-80" />
      <p className="italic text-gray-700 dark:text-gray-300 mt-4">{text}</p>
      <p className="mt-4 font-semibold text-indigo-600 dark:text-indigo-400">{name}</p>
    </motion.div>
  );
}

/* ✅ CTA */
function CTASection({ navigate }) {
  return (
    <section className="w-full text-center py-20 bg-indigo-600 text-white px-4 sm:px-10 md:px-16">
      <motion.h2
        initial={{ scale: 0.92 }}
        whileInView={{ scale: 1 }}
        transition={{ duration: 0.5 }}
        className="text-4xl font-extrabold mb-4"
      >
        Start Managing Events Like a Pro
      </motion.h2>

      <p className="opacity-90 mb-6 text-lg">
        Join thousands of organizers already using DEMP.
      </p>

      <motion.button
        whileHover={{ scale: 1.1 }}
        onClick={() => navigate("register")}
        className="px-10 py-4 bg-white text-indigo-700 rounded-lg font-semibold shadow-lg hover:bg-gray-100"
      >
        Create Your Free Account <ArrowRight className="inline ml-2" />
      </motion.button>
    </section>
  );
}

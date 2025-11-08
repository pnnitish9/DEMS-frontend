import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar,
  Users,
  ShieldCheck,
  Menu,
  Moon,
  Sun,
  Quote,
  ArrowRight,
  X
} from "lucide-react";
import { usePageContext } from "../context/PageContext";

export default function LandingPage() {
  const { navigate } = usePageContext();

  /* ✅ DARK MODE */
  const [dark, setDark] = useState(localStorage.getItem("theme") === "dark");

  const toggleTheme = () => {
    const newTheme = !dark;
    setDark(newTheme);
    document.documentElement.classList.toggle("dark", newTheme);
    localStorage.setItem("theme", newTheme ? "dark" : "light");
  };

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
  }, []);

  /* ✅ SMOOTH TYPEWRITER */
  const words = [
    "Manage Events Effortlessly",
    "Track Registrations",
    "Scan QR Check-ins",
    "Organize Like a Pro",
  ];

  const [index, setIndex] = useState(0);
  const [subIndex, setSubIndex] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setSubIndex((prev) => prev + (deleting ? -1 : 1));

      if (!deleting && subIndex === words[index].length) {
        setTimeout(() => setDeleting(true), 900);
      } else if (deleting && subIndex === 0) {
        setDeleting(false);
        setIndex((prev) => (prev + 1) % words.length);
      }
    }, deleting ? 40 : 90);

    return () => clearTimeout(timeout);
  }, [subIndex, deleting, index]);

  /* ✅ NAVBAR BLUR ON SCROLL */
  const [navBlur, setNavBlur] = useState(false);

  useEffect(() => {
    const handleScroll = () => setNavBlur(window.scrollY > 15);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  /* ✅ MOBILE MENU */
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="relative min-h-screen w-full bg-gradient-to-b from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-black dark:to-black text-gray-800 dark:text-gray-200">

      {/* ✅ NAVBAR */}
      <motion.nav
        animate={{
          backdropFilter: navBlur ? "blur(14px)" : "blur(0px)",
          backgroundColor: navBlur
            ? "rgba(11, 66, 247, 0.25)"
            : "rgba(48, 37, 37, 0.17)",
        }}
        className="fixed top-0 left-0 w-full z-50 px-6 sm:px-10 md:px-16 py-4 flex justify-between items-center transition-all"
      >
        <h1 className="font-extrabold text-3xl bg-gradient-to-r from-red-500 via-blue-500 to-red-500 bg-clip-text text-transparent animate-blue-yellow">
          Event Advent
        </h1>


        {/* ✅ DESKTOP NAV */}
        <div className="hidden md:flex items-center gap-6 text-white">
          <button onClick={() => navigate("login")} className="hover:text-indigo-400">
            Login
          </button>

          <button
            onClick={() => navigate("register")}
            className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow"
          >
            Get Started
          </button>

          <button
            onClick={toggleTheme}
            className="p-2 rounded-full bg-gray-800 text-yellow-400 shadow-md"
          >
            {dark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5 text-white" />}
          </button>
        </div>

        {/* ✅ MOBILE NAV TOGGLE */}
        <button
          className="md:hidden text-white"
          onClick={() => setMobileOpen(true)}
        >
          <Menu className="w-7 h-7" />
        </button>
      </motion.nav>

      {/* ✅ MOBILE MENU DROPDOWN */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            className="fixed top-0 left-0 w-full bg-black/80 backdrop-blur-xl p-6 z-50 md:hidden"
          >
            <div className="flex justify-between items-center text-white">
              <h1 className="text-2xl font-bold">Event Advent</h1>

              <button onClick={() => setMobileOpen(false)}>
                <X className="w-7 h-7" />
              </button>
            </div>

            <div className="mt-8 flex flex-col gap-6 text-white">
              <button
                onClick={() => {
                  navigate("login");
                  setMobileOpen(false);
                }}
                className="text-lg"
              >
                Login
              </button>

              <button
                onClick={() => {
                  navigate("register");
                  setMobileOpen(false);
                }}
                className="text-lg bg-indigo-600 px-5 py-2 rounded-lg"
              >
                Get Started
              </button>

              <button
                onClick={toggleTheme}
                className="p-2 mt-2 rounded-full bg-gray-700 self-start"
              >
                {dark ? <Sun /> : <Moon />}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ✅ BACKGROUND BLOBS */}
      <BackgroundBlobs />

      {/* ✅ HERO */}
      <section className="w-full pt-40 pb-28 px-4 sm:px-10 md:px-16 grid lg:grid-cols-2 gap-16 items-center">

        {/* LEFT */}
        <motion.div initial={{ opacity: 0, x: -70 }} animate={{ opacity: 1, x: 0 }}>
          <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 dark:text-white">
            {words[index].substring(0, subIndex)}
            <span className="text-indigo-600">|</span>
          </h1>

          <p className="mt-6 text-lg max-w-xl">
            The all-in-one event management portal for colleges and communities.
          </p>

          <div className="mt-10 flex gap-4 flex-wrap">
            <motion.button
              onClick={() => navigate("register")}
              whileHover={{ scale: 1.05 }}
              className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg shadow"
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

        {/* RIGHT IMAGE */}
        <motion.img
          initial={{ opacity: 0, scale: 0.88 }}
          animate={{ opacity: 1, scale: 1 }}
          whileHover={{ scale: 1.03 }}
          transition={{ duration: 0.9 }}
          src="https://www.pingpongmoments.in/blog/wp-content/uploads/2022/09/corporate-events-3.jpg"
          className="w-full max-w-lg mx-auto rounded-2xl border-4 border-white dark:border-gray-800 shadow-xl shadow-indigo-300/40 dark:shadow-indigo-900/40"
        />
      </section>

      <FeaturesSection />
      <TestimonialsSection />
      <CTASection navigate={navigate} />

      <footer className="py-6 text-center text-gray-700 dark:text-gray-400">
        © {new Date().getFullYear()} Event Advent — by Just a moment... TEAM
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

/* ✅ FEATURE SECTION */
function FeaturesSection() {
  const cards = [
    { icon: Calendar, title: "Easy Event Creation", desc: "Create events instantly." },
    { icon: Users, title: "Smart Registrations", desc: "Quick participant onboarding." },
    { icon: ShieldCheck, title: "Secure System", desc: "Powerful role-based access." },
  ];

  return (
    <section className="w-full py-20 bg-white dark:bg-gray-950 px-4 sm:px-10 md:px-16">
      <h2 className="text-4xl font-bold text-center">Why Choose Event Advent?</h2>

      <div className="mt-14 grid md:grid-cols-3 gap-10 max-w-6xl mx-auto">
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
      className="text-center p-8 rounded-xl shadow-md bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800"
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
    { img: "https://randomuser.me/api/portraits/men/32.jpg", name: "Amit Sharma", text: "Event Advent improved our event flow." },
    { img: "https://randomuser.me/api/portraits/women/44.jpg", name: "Riya Patel", text: "The organizer tools are powerful!" },
    { img: "https://randomuser.me/api/portraits/men/76.jpg", name: "Manish Kumar", text: "QR check-in is lightning fast." },
  ];

  return (
    <section className="w-full py-24 bg-gray-50 dark:bg-gray-800 px-4 sm:px-10 md:px-16">
      <h2 className="text-4xl font-bold text-center mb-14">Loved by Students & Organizers</h2>

      <div className="grid md:grid-cols-3 gap-10 max-w-6xl mx-auto">
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
      className="p-6 bg-white dark:bg-gray-900 shadow-xl rounded-xl text-center border border-gray-200 dark:border-gray-800"
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

/* ✅ CTA SECTION */
function CTASection({ navigate }) {
  return (
    <section className="w-full text-center py-20 bg-indigo-600 text-white px-4">
      <motion.h2
        initial={{ scale: 0.92 }}
        whileInView={{ scale: 1 }}
        transition={{ duration: 0.5 }}
        className="text-4xl font-extrabold mb-4"
      >
        Start Managing Events Like a Pro
      </motion.h2>

      <p className="opacity-90 mb-6 text-lg">
        Join thousands of organizers already using Event Advent.
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

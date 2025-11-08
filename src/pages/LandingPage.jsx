import React from "react";
import { motion } from "framer-motion";
import {
  Calendar,
  Users,
  ShieldCheck,
  Smartphone,
  Quote,
} from "lucide-react";
import { usePageContext } from "../context/PageContext";

export default function LandingPage() {
  const { navigate } = usePageContext();

  return (
    <div className="relative min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200 overflow-hidden">

      {/* ✅ Animated Background Shapes */}
      <motion.div
        initial={{ opacity: 0, x: -100, y: -100 }}
        animate={{ opacity: 0.15, x: 0, y: 0 }}
        transition={{ duration: 3, repeat: Infinity, repeatType: "mirror" }}
        className="absolute top-0 left-0 w-72 h-72 bg-indigo-400 opacity-20 dark:bg-indigo-700 rounded-full blur-3xl"
      ></motion.div>

      <motion.div
        initial={{ opacity: 0, x: 100, y: 100 }}
        animate={{ opacity: 0.1, x: 0, y: 0 }}
        transition={{ duration: 4, repeat: Infinity, repeatType: "mirror" }}
        className="absolute bottom-0 right-0 w-80 h-80 bg-purple-500 opacity-20 dark:bg-purple-700 rounded-full blur-2xl"
      ></motion.div>

      {/* ✅ Hero Section */}
      <section className="relative px-6 lg:px-20 py-24 grid lg:grid-cols-2 gap-12 items-center z-10">

        {/* HERO TEXT */}
        <motion.div
          initial={{ opacity: 0, x: -80 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
        >
          <h1 className="text-4xl md:text-6xl font-extrabold leading-tight">
            Manage Events  
            <span className="text-indigo-600"> Effortlessly</span> with DEMP
          </h1>

          <p className="mt-4 text-lg text-gray-600 dark:text-gray-300 max-w-xl">
            The Digital Event Management Portal built for colleges & communities.
            Organize, promote, register, and manage events with ease.
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              onClick={() => navigate("register")}
              className="px-6 py-3 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-lg"
            >
              Get Started
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              onClick={() => navigate("login")}
              className="px-6 py-3 rounded-lg border border-gray-400 dark:border-gray-700 hover:bg-gray-200 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 font-semibold text-lg"
            >
              Login
            </motion.button>
          </div>
        </motion.div>

        {/* ✅ HERO IMAGE */}
        <motion.img
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9 }}
          src="https://cdni.iconscout.com/illustration/premium/thumb/event-management-illustration-download-in-svg-png-gif-file-formats--meeting-conference-admin-people-pack-illustrations-3422027.png"
          alt="Hero Illustration"
          className="w-full max-w-lg mx-auto drop-shadow-xl z-20"
        />
      </section>

      {/* ✅ Features */}
      <section className="px-6 lg:px-20 py-16 bg-white dark:bg-gray-950 z-10 relative">
        <h2 className="text-3xl font-bold text-center">Why Choose DEMP?</h2>

        <div className="mt-12 grid md:grid-cols-3 gap-10 max-w-6xl mx-auto">
          <FeatureCard
            icon={Calendar}
            title="Easy Event Creation"
            desc="Create and publish events in under a minute."
          />

          <FeatureCard
            icon={Users}
            title="Smart Registrations"
            desc="Participants can explore and register instantly."
          />

          <FeatureCard
            icon={ShieldCheck}
            title="Secure System"
            desc="Role-based access for admins, organizers & users."
          />
        </div>
      </section>

      {/* ✅ Testimonials with Images */}
      <section className="px-6 lg:px-20 py-20 bg-gray-100 dark:bg-gray-800 relative">
        <h2 className="text-3xl font-bold text-center mb-12">
          What People Say About DEMP
        </h2>

        <div className="grid md:grid-cols-3 gap-10 max-w-6xl mx-auto">

          <Testimonial
            img="https://randomuser.me/api/portraits/men/32.jpg"
            name="Amit Sharma"
            text="DEMP transformed the way we manage events in college!"
          />

          <Testimonial
            img="https://randomuser.me/api/portraits/women/44.jpg"
            name="Riya Patel"
            text="The organizer dashboard is super simple and powerful."
          />

          <Testimonial
            img="https://randomuser.me/api/portraits/men/76.jpg"
            name="Manish Kumar"
            text="Dark mode is beautiful. Very smooth experience!"
          />

        </div>
      </section>

      {/* ✅ CTA Section */}
      <section className="text-center py-20 bg-indigo-600 text-white">
        <motion.h2
          initial={{ scale: 0.9 }}
          whileInView={{ scale: 1 }}
          transition={{ duration: 0.5 }}
          className="text-4xl font-extrabold mb-4"
        >
          Start Managing Events Like a Pro
        </motion.h2>

        <p className="opacity-90 mb-6 text-lg">
          Join thousands of students and organizers using DEMP daily.
        </p>

        <motion.button
          whileHover={{ scale: 1.1 }}
          onClick={() => navigate("register")}
          className="px-10 py-4 bg-white text-indigo-700 rounded-lg font-semibold shadow-lg hover:bg-gray-100"
        >
          Create Your Free Account
        </motion.button>
      </section>

      {/* ✅ Footer */}
      <footer className="py-6 text-center text-gray-600 dark:text-gray-400">
        © {new Date().getFullYear()} DEMP — Digital Event Management Portal
      </footer>
    </div>
  );
}

/* ✅ Reusable Cards */

function FeatureCard({ icon: Icon, title, desc }) {
  return (
    <motion.div
      whileHover={{ scale: 1.04 }}
      className="text-center p-6 rounded-lg border dark:border-gray-700 bg-gray-50 dark:bg-gray-900 shadow"
    >
      <Icon className="w-12 h-12 mx-auto text-indigo-600 mb-4" />
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-600 dark:text-gray-300">{desc}</p>
    </motion.div>
  );
}

function Testimonial({ img, name, text }) {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      className="p-6 bg-white dark:bg-gray-900 shadow-lg rounded-xl text-center"
    >
      <img
        src={img}
        alt={name}
        className="w-20 h-20 rounded-full mx-auto border-4 border-indigo-600 object-cover"
      />
      <Quote className="w-8 h-8 mx-auto text-indigo-600 mt-4" />
      <p className="italic text-gray-700 dark:text-gray-300 mt-4">"{text}"</p>
      <p className="mt-4 font-semibold text-indigo-600 dark:text-indigo-400">
        {name}
      </p>
    </motion.div>
  );
}

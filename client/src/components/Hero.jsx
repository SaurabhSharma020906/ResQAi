import { motion } from "framer-motion";
import { FaArrowRight } from "react-icons/fa";
import { Link } from "react-router-dom";

function Hero() {
  return (
    <section className="bg-slate-100 min-h-[90vh] flex items-center">
      <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-10 items-center">

        {/* Left */}
        <motion.div
          initial={{ opacity: 0, x: -80 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <p className="text-red-600 font-semibold mb-3">
            🚨 AI Powered Emergency Management
          </p>

          <h1 className="text-6xl font-extrabold text-slate-900 leading-tight">
            Respond Faster
            <br />
            Save More Lives
          </h1>

          <p className="text-slate-600 mt-6 text-lg">
            ResQAI helps citizens report emergencies instantly using
            Artificial Intelligence and real-time response systems.
          </p>

          <div className="flex gap-4 mt-8">

            <Link to="/report">
              <button className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-xl flex items-center gap-2">
                Report Incident
                <FaArrowRight />
              </button>
            </Link>

            <button className="border border-slate-400 px-6 py-3 rounded-xl hover:bg-slate-200">
              Learn More
            </button>

          </div>

        </motion.div>

        {/* Right */}
        <motion.div
          initial={{ opacity: 0, x: 80 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="flex justify-center"
        >
          <img
            src="https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?w=700"
            alt="Emergency"
            className="rounded-3xl shadow-2xl"
          />
        </motion.div>

      </div>
    </section>
  );
}

export default Hero;
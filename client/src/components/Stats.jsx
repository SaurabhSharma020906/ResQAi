import { motion } from "framer-motion";
import { FaExclamationTriangle, FaUsers, FaRobot, FaClock } from "react-icons/fa";

const stats = [
  {
    icon: <FaExclamationTriangle />,
    value: "12K+",
    label: "Incidents Reported",
    color: "text-red-500",
  },
  {
    icon: <FaUsers />,
    value: "520+",
    label: "Emergency Teams",
    color: "text-blue-500",
  },
  {
    icon: <FaRobot />,
    value: "98%",
    label: "AI Accuracy",
    color: "text-green-500",
  },
  {
    icon: <FaClock />,
    value: "< 2 min",
    label: "Average Response",
    color: "text-yellow-500",
  },
];

function Stats() {
  return (
    <section className="bg-white py-20">
      <div className="max-w-7xl mx-auto px-6">

        <motion.h2
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="text-4xl font-bold text-center mb-14"
        >
          Live Platform Statistics
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">

          {stats.map((item, index) => (
            <motion.div
              key={index}
              whileHover={{ y: -8 }}
              className="bg-slate-900 text-white rounded-2xl p-8 shadow-xl text-center"
            >
              <div className={`text-5xl mb-5 ${item.color}`}>
                {item.icon}
              </div>

              <h3 className="text-4xl font-bold">{item.value}</h3>

              <p className="mt-3 text-slate-300">
                {item.label}
              </p>

            </motion.div>
          ))}

        </div>
      </div>
    </section>
  );
}

export default Stats;
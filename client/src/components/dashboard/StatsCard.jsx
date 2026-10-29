
function StatsCard({
  title,
  value,
  icon,
  color = "bg-red-600",
  textColor = "text-white",
}) {
  return (
    <div
      className={`${color} ${textColor} rounded-2xl shadow-lg p-6 hover:scale-105 transition-all duration-300`}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm opacity-80">{title}</p>

          <h2 className="text-3xl font-bold mt-2">
            {value}
          </h2>
        </div>

        <div className="text-5xl">
          {icon}
        </div>
      </div>
    </div>
  );
}

export default StatsCard;
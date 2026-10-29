import { useNavigate } from "react-router-dom";

function QuickActions() {
  const navigate = useNavigate();

  const actions = [
    {
      title: "Report Emergency",
      icon: "🚨",
      color: "bg-red-600",
      description: "Report a new emergency",
      path: "/report-incident",
    },
    {
      title: "My Incidents",
      icon: "📋",
      color: "bg-blue-600",
      description: "View all your incidents",
      path: "/my-incidents",
    },
    {
      title: "Live Map",
      icon: "🗺️",
      color: "bg-green-600",
      description: "Coming Soon",
      disabled: true,
    },
    {
      title: "Emergency Contacts",
      icon: "📞",
      color: "bg-orange-500",
      description: "Coming Soon",
      disabled: true,
    },
  ];

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
      {actions.map((action) => (
        <button
          key={action.title}
          onClick={() =>
            action.disabled
              ? alert(`${action.title} feature coming soon!`)
              : navigate(action.path)
          }
          className={`${action.color} text-white rounded-2xl shadow-lg p-6 text-left hover:scale-105 transition duration-300`}
        >
          <div className="text-5xl">{action.icon}</div>

          <h2 className="text-xl font-bold mt-4">
            {action.title}
          </h2>

          <p className="mt-2 text-sm opacity-90">
            {action.description}
          </p>
        </button>
      ))}
    </div>
  );
}

export default QuickActions;
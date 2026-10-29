import {
  TriangleAlert,
  Clock3,
  Ambulance,
  CheckCircle,
} from "lucide-react";

function AdminStats({ stats }) {
  const cards = [
    {
      title: "Total Incidents",
      value: stats.total,
      color: "bg-red-600",
      icon: <TriangleAlert size={42} />,
    },
    {
      title: "Pending",
      value: stats.pending,
      color: "bg-yellow-500",
      icon: <Clock3 size={42} />,
    },
    {
      title: "Assigned",
      value: stats.active,
      color: "bg-blue-600",
      icon: <Ambulance size={42} />,
    },
    {
      title: "Resolved",
      value: stats.resolved,
      color: "bg-green-600",
      icon: <CheckCircle size={42} />,
    },
  ];

  return (
    <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">

      {cards.map((card) => (

        <div
          key={card.title}
          className={`${card.color} rounded-2xl text-white p-6 shadow-lg flex justify-between items-center`}
        >
          <div>

            <p className="opacity-90">
              {card.title}
            </p>

            <h2 className="text-4xl font-bold mt-3">
              {card.value}
            </h2>

          </div>

          <div>
            {card.icon}
          </div>

        </div>

      ))}

    </div>
  );
}

export default AdminStats;
function IncidentPopup({ incident }) {
  return (
    <div className="min-w-[220px]">

      <h3 className="font-bold text-lg">
        🚨 {incident.emergencyType}
      </h3>

      <p>
        <strong>Status:</strong> {incident.status}
      </p>

      <p>
        <strong>Priority:</strong> {incident.priority}
      </p>

      <p>
        <strong>Severity:</strong> {incident.severity}
      </p>

      <p>
        <strong>ETA:</strong>{" "}
        {incident.estimatedResponseTime}
      </p>

      <hr className="my-2"/>

      <p className="text-sm">
        {incident.description}
      </p>

    </div>
  );
}

export default IncidentPopup;
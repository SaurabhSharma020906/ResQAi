import {
  Ambulance,
  Shield,
  Flame,
  MapPin,
  Send,
  Loader2,
} from "lucide-react";

function NearbyServices({
  services = [],
  loading = false,
  dispatching = null,
  dispatchService,
}) {
  const getIcon = (type = "") => {
    const value = type.toLowerCase();

    if (value.includes("ambulance"))
      return (
        <Ambulance
          className="text-red-600"
          size={22}
        />
      );

    if (value.includes("police"))
      return (
        <Shield
          className="text-blue-600"
          size={22}
        />
      );

    if (value.includes("fire"))
      return (
        <Flame
          className="text-orange-600"
          size={22}
        />
      );

    return (
      <MapPin
        className="text-slate-600"
        size={22}
      />
    );
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">

      {/* Header */}

      <div className="bg-blue-700 text-white px-6 py-4">

        <h2 className="text-xl font-bold">
          Nearby Emergency Services
        </h2>

      </div>

      <div className="p-6">

        {/* Loading */}

        {loading && (
          <div className="flex justify-center py-10">

            <Loader2
              size={30}
              className="animate-spin text-blue-600"
            />

          </div>
        )}

        {/* Empty */}

        {!loading &&
          services.length === 0 && (
            <div className="text-center py-8 text-gray-500">

              No nearby services found.

            </div>
          )}

        {/* Services */}

        {!loading && services.length > 0 && (
          <div className="space-y-5">

            {services.map((service, index) => {
              const id =
                service.id ||
                service._id ||
                index;

              return (
                <div
                  key={id}
                  className="border rounded-2xl p-5 hover:shadow-md transition"
                >
                  <div className="flex justify-between">

                    <div className="flex gap-4">

                      <div className="bg-slate-100 rounded-xl p-3">

                        {getIcon(service.type)}

                      </div>

                      <div>

                        <h3 className="font-bold text-lg">

                          {service.name}

                        </h3>

                        <p className="text-gray-500 text-sm">

                          {service.type}

                        </p>

                        {service.address && (
                          <p className="text-sm mt-2">

                            {service.address}

                          </p>
                        )}

                        {service.distance !==
                          undefined && (
                          <p className="text-sm mt-1 text-blue-600 font-medium">

                            {(Number(
                              service.distance
                            )).toFixed(2)}
                            {" km away"}

                          </p>
                        )}

                      </div>

                    </div>

                    <div>

                      <button
                        onClick={() =>
                          dispatchService(service)
                        }
                        disabled={
                          dispatching === id
                        }
                        className="bg-green-600 hover:bg-green-700 disabled:bg-gray-300 text-white px-5 py-3 rounded-xl flex items-center gap-2 transition"
                      >
                        {dispatching === id ? (
                          <>
                            <Loader2
                              size={18}
                              className="animate-spin"
                            />

                            Dispatching

                          </>
                        ) : (
                          <>
                            <Send size={18} />

                            Dispatch

                          </>
                        )}
                      </button>

                    </div>

                  </div>
                </div>
              );
            })}

          </div>
        )}

      </div>

    </div>
  );
}

export default NearbyServices;
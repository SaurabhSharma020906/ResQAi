import api from "./api";

export const reportIncident = async (formData) => {
  const response = await api.post("/incidents", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};

export const getMyIncidents = async () => {
  const response = await api.get("/incidents/my");
  return response.data;
};
export const getIncidentById = async (id) => {
  const response = await api.get(`/incidents/${id}`);
  return response.data;
};
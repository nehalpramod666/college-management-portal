import api from "./api";

export const getFaculty = async () => {
  const { data } = await api.get("/faculty");
  return data;
};

export const createFaculty = async (facultyData) => {
  const { data } = await api.post(
    "/faculty",
    facultyData
  );

  return data;
};

export const deleteFaculty = async (id) => {
  const { data } = await api.delete(
    `/faculty/${id}`
  );

  return data;
};
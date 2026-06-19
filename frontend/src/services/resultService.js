import api from "./api";

export const getResults = async () => {
  const { data } = await api.get("/results");
  return data;
};

export const createResult = async (resultData) => {
  const { data } = await api.post(
    "/results",
    resultData
  );

  return data;
};

export const updateResult = async (
  id,
  resultData
) => {
  const { data } = await api.put(
    `/results/${id}`,
    resultData
  );

  return data;
};
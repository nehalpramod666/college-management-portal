import api from "./api";

export const getDepartments = async () => {
  const { data } = await api.get("/departments");
  return data;
};

export const createDepartment = async (
  departmentData
) => {
  const { data } = await api.post(
    "/departments",
    departmentData
  );

  return data;
};

export const deleteDepartment = async (id) => {
  const { data } = await api.delete(
    `/departments/${id}`
  );

  return data;
};
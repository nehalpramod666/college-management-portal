import api from "./api";

export const getAttendance = async () => {
  const { data } = await api.get("/attendance");
  return data;
};

export const markAttendance = async (
  attendanceData
) => {
  const { data } = await api.post(
    "/attendance",
    attendanceData
  );

  return data;
};
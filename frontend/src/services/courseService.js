import api from "./api";

export const getCourses = async () => {
  const { data } = await api.get("/courses");
  return data;
};

export const createCourse = async (courseData) => {
  const { data } = await api.post(
    "/courses",
    courseData
  );

  return data;
};

export const deleteCourse = async (id) => {
  const { data } = await api.delete(
    `/courses/${id}`
  );

  return data;
};
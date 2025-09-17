import apiService from "./apiService";

const getProjectSummary = async (name) => {
  try {
    const { data } = await apiService({
      endpoint: `/project/${name}/summary`,
      method: "GET",
    });
    return data;
  } catch (error) {
    return console.error(error), [];
  }
};

export default getProjectSummary;

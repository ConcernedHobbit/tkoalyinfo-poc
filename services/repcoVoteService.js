const BY_FACULTY = "http://vaalitulos.hyy.fi/2022/votes_by_faculty.json";
const BY_HOUR = "http://vaalitulos.hyy.fi/2022/votes_by_hour.json";

export const fetchSciencePercentage = async () => {
  try {
    const result = await fetch(BY_FACULTY);
    const data = await result.json();
    const matlu = data?.children?.faculties?.find(
      obj => obj && obj.name && obj.name === "Maatalous-metsätieteellinen"
    );
    return matlu?.percentage;
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const fetchTotalPercentage = async () => {
  try {
    const result = await fetch(BY_HOUR);
    const data = await result.json();
    return data?.children?.total?.percentage;
  } catch (error) {
    console.error(error);
    return null;
  }
};

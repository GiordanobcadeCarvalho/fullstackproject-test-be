export const fetchIso3FromIso2 = async (iso2: string): Promise<string | null> => {
  try {
    const response = await fetch(`${process.env.ISO3}/${iso2}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch ISO3 code for ${iso2}`);
    }
    const countryData = await response.json();
    return countryData[0].cca3;
  } catch (error) {
    console.error(error);
    return null;
  }
};

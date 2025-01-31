import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { fetchIso3FromIso2 } from "./utils/fetchIso3";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 7565;

app.use(express.json());

app.use(
  cors({
    origin: "http://localhost:3000",
  })
);

app.get("/", (req, res) => {
  res.json({ message: "Server is running!" });
});

const fetchData = async (endpoint: string) => {
  try {
    const response = await fetch(`${endpoint}`);
    if (!response.ok) {
      throw new Error(`Error fetching API: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    throw new Error((error as Error).message);
  }
};

app.get("/availableCountries", async (req, res) => {
  try {
    const data = await fetchData(
      "https://date.nager.at/api/v3/AvailableCountries"
    );
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

app.get("/countryInfoUa", async (req, res) => {
  const { countryCode } = req.query;
  try {
    const data = await fetchData(
      `https://date.nager.at/api/v3/CountryInfo/${countryCode}`
    );
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

app.post("/countriesPopulation", async (req, res) => {
  const { countryCode } = req.body;

  const iso3 = await fetchIso3FromIso2(countryCode);

  try {
    const response = await fetch(
      "https://countriesnow.space/api/v0.1/countries/population",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ iso3 }),
      }
    );

    const data = await response.json();
    console.log(data);
    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: (error as Error).message });
  }
});


app.post("/countriesFlag", async (req, res) => {
  const { countryCode } = req.body;

  try {
    const response = await fetch(
      "https://countriesnow.space/api/v0.1/countries/flag/images",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ iso2: countryCode }),
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch flag data: ${response.statusText}`);
    }

    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

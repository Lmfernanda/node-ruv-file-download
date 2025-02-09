const express = require("express");
const fetch = require("node-fetch");
const fs = require("fs");
const path = require("path");
const os = require("os");
const { parse } = require("json2csv");

const app = express();
const PORT = 3000;

const departamentos = {
    "amazonas": 91,
    "caqueta": 18,
    "cauca": 19,
    "guainia": 94,
    "guaviare": 95,
    "meta": 50,
    "narino": 52,
    "putumayo": 86,
    "vaupes": 97,
    "vichada": 99
};

// API base URL
const BASE_URL = "https://cifras2.unidadvictimas.gov.co/RNI.Reportes.Servicios/api/Cifras/DatosAbiertos";

// Get the Downloads folder path dynamically
const DOWNLOADS_FOLDER = path.join(os.homedir(), "Downloads");

// Define the required columns
const CSV_FIELDS = [
    "FECHA_CORTE", "NOM_RPT", "COD_PAIS", "PAIS",
    "COD_ESTADO_DEPTO", "ESTADO_DEPTO", "COD_CIUDAD_MUNI", "CIUDAD_MUNICIPIO",
    "VIGENCIA", "PARAM_HECHO", "HECHO", "SEXO",
    "ETNIA", "DISCAPACIDAD", "CICLO_VITAL", "PER_OCU", "PER_DECLA", "EVENTOS"
];

// Function to fetch and save data for a single department
const fetchAndSaveData = async (key, value) => {
    try {
        const url = `${BASE_URL}?idReporte=5&nivelTerritorial=2&fechaReporte=31/12/2024&anio=0&idDepartamento=${value}&idMunicipio=0&idDireccionTerritorial=0`;
        console.log(`Fetching data for ${key} (${value}) from: ${url}`);

        // Fetch the data
        const response = await fetch(url);
        if (!response.ok) throw new Error(`Error fetching ${key}: ${response.statusText}`);

        const jsonData = await response.json(); // Read as JSON

        // Ensure data is an array and contains objects
        if (!Array.isArray(jsonData)) throw new Error(`Invalid JSON response format for ${key}`);

        // Extract only required columns
        const filteredData = jsonData.map(item => {
            return CSV_FIELDS.reduce((obj, field) => {
                obj[field] = item[field] || ""; // Ensure missing values don't break
                return obj;
            }, {});
        });

        // Convert JSON to CSV
        const csv = parse(filteredData, { fields: CSV_FIELDS });

        // Generate the file path
        const fileName = `downloaded_file_${key}.csv`;
        const filePath = path.join(DOWNLOADS_FOLDER, fileName);

        // Save the CSV file
        fs.writeFileSync(filePath, csv);
        console.log(`File saved for ${key}: ${filePath}`);
    } catch (error) {
        console.error(`Error processing ${key}:`, error);
    }
};

// Route to trigger fetching all departments
app.get("/api/v1/files", async (req, res) => {
    try {
        // Fetch data for all departments in parallel
        await Promise.all(
            Object.entries(departamentos).map(([key, value]) => fetchAndSaveData(key, value))
        );

        res.json({ message: "All files downloaded successfully", path: DOWNLOADS_FOLDER });
    } catch (error) {
        console.error("Error in API:", error);
        res.status(500).json({ error: "Failed to fetch and process files" });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

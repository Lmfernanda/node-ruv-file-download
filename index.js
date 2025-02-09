const express = require("express");
const fetch = require("node-fetch");
const fs = require("fs");
const path = require("path");
const os = require("os");
const { parse } = require("json2csv");

const app = express();
const PORT = 9080;

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

const BASE_URL = "https://cifras2.unidadvictimas.gov.co/RNI.Reportes.Servicios/api/Cifras/DatosAbiertos";

const DOWNLOADS_FOLDER = path.join(os.homedir(), "Downloads");

const CSV_FIELDS = [
    "FECHA_CORTE", "NOM_RPT", "COD_PAIS", "PAIS",
    "COD_ESTADO_DEPTO", "ESTADO_DEPTO", "COD_CIUDAD_MUNI", "CIUDAD_MUNICIPIO",
    "VIGENCIA", "PARAM_HECHO", "HECHO", "SEXO",
    "ETNIA", "DISCAPACIDAD", "CICLO_VITAL", "PER_OCU", "PER_DECLA", "EVENTOS"
];

const fetchAndSaveData = async (key, value) => {
    try {
        const url = `${BASE_URL}?idReporte=5&nivelTerritorial=2&fechaReporte=31/12/2024&anio=0&idDepartamento=${value}&idMunicipio=0&idDireccionTerritorial=0`;
        console.log(`Fetching data for ${key} (${value}) from: ${url}`);

        const response = await fetch(url);
        if (!response.ok) throw new Error(`Error fetching ${key}: ${response.statusText}`);

        const jsonData = await response.json();

        if (!Array.isArray(jsonData)) throw new Error(`Invalid JSON response format for ${key}`);

        const filteredData = jsonData.map(item => {
            return CSV_FIELDS.reduce((obj, field) => {
                obj[field] = item[field] || "";
                return obj;
            }, {});
        });

        const csv = parse(filteredData, { fields: CSV_FIELDS });

        const fileName = `downloaded_file_${key}.csv`;
        const filePath = path.join(DOWNLOADS_FOLDER, fileName);

        fs.writeFileSync(filePath, csv);
        console.log(`File saved for ${key}: ${filePath}`);
    } catch (error) {
        console.error(`Error processing ${key}:`, error);
    }
};

app.get("/api/v1/files", async (req, res) => {
    try {
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

# RUV CSV Downloader Microservice

## 📌 Overview

The **RUV CSV Downloader Microservice** is a Node.js application that fetches **victim registry (Registro Único de Víctimas - RUV)** data for specific **Colombian departments** and saves it as CSV files.

Each department's data is retrieved from the **Unidad para las Víctimas API**, processed, and stored in the user's **Downloads** folder.

---

## 🚀 Features
- ✅ **Fetches victim registry data** from the RUV API.
- ✅ **Processes data for multiple departments** dynamically.
- ✅ **Extracts only relevant fields** to generate clean CSV files.
- ✅ **Saves CSV files** in the user's `Downloads` folder.
- ✅ **Runs on Express.js** with a single endpoint.

---

## 🔧 Installation

1. **Clone the repository**:
   ```sh
   git clone https://github.com/your-username/ruv-downloader.git
   cd ruv-downloader
   ```

2. **Install dependencies**:
   ```sh
   npm install
   ```

---

## ⚙️ Configuration

- The list of **departments** and their corresponding `idDepartamento` values are preconfigured in the script.
- The base API endpoint is:
  ```
  https://cifras2.unidadvictimas.gov.co/RNI.Reportes.Servicios/api/Cifras/DatosAbiertos
  ```

---

## ▶️ Usage

### Start the server
```sh
npm start
```

### Fetch and Download CSV Files
Once the server is running, make a GET request:
```sh
curl -X GET "http://localhost:9080/api/v1/files"
```
This will **fetch data for all departments** listed in the script and save the corresponding CSV files in your **Downloads** folder.

---

## 📂 Output Files

Each department's CSV file is named using this format:
```
downloaded_file_{department}.csv
```
For example:
```
downloaded_file_amazonas.csv
downloaded_file_guainia.csv
downloaded_file_meta.csv
...
```
These files are stored in:
```
C:\Users\YourUser\Downloads\
```
on Windows or
```
/Users/YourUser/Downloads/
```
on macOS/Linux.

---

## 🛠️ Tech Stack

- **Node.js** - Backend runtime
- **Express.js** - API framework
- **node-fetch** - HTTP requests
- **json2csv** - Data transformation
- **fs, path, os** - File handling utilities

---

## 📌 API Details

**Endpoint:**  
```
GET /api/v1/files
```
**Response:**
```json
{
  "message": "All files downloaded successfully",
  "path": "/Users/mariafernandalopez/Downloads"
}
```

---

## 🐜 License

This project is open-source and available under the **MIT License**.

---

## 👩‍💻 Author

**Maria Fernanda Lopez**  
🏋️ Software Developer  
📧 [your-email@example.com](mailto:your-email@example.com)  
🔗 [LinkedIn](https://linkedin.com/in/your-profile)  
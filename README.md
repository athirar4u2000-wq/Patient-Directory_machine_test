# React Developer Practical Test - Patient Directory

A React application built with **Vite** that fetches and displays patient records from the Lupinary Clinic API in a clean, responsive, and readable table.

---

## 🚀 Quick Start

### 1. Install dependencies
```bash
npm install
```

### 2. Start the development server
```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### 3. Build for production
```bash
npm run build
```

---

## 📋 Requirements & Implementation Checklist

| Requirement | Implementation Details | Status |
| :--- | :--- | :---: |
| **Vite & React** | Built using modern React (Hooks, functional components) with Vite 8 | ✅ Complete |
| **Basic Auth** | Encodes `username:password` as `Basic <base64>` in HTTP `Authorization` header | ✅ Complete |
| **Table Columns** | Displays all 6 required columns: **Reg. ID**, **Name**, **Gender**, **Age**, **Mobile**, **Address** | ✅ Complete |
| **Loading State** | Shows a clear loading message and animated skeleton placeholders while fetching | ✅ Complete |
| **Error Handling** | Displays an error card with error details and a "Try Again" retry action | ✅ Complete |
| **Empty Field Placeholder** | Empty or null fields render a consistent placeholder dash (`-`) | ✅ Complete |
| **Table Alignment** | Clean fixed/proportional column widths, subtle badges, responsive horizontal scrolling | ✅ Complete |
| **Pagination & Search** | Supports page navigation (`page_no`) and live instant search across patient fields | ✅ Complete |

---

## 🔍 Investigation: Why Postman Works But Browser Fails (CORS)

### The Problem
- In **Postman**, making a `GET` request to `https://demo.lupinary.com/api/patients?user_id=1&clinic_id=1&page_no=0` with Basic Auth credentials succeeds immediately with **HTTP 200 OK**.
- However, when attempting the exact same `fetch()` or `axios` call directly from a browser, the request fails with a **CORS error** (`TypeError: Failed to fetch`).

### Root Cause Analysis
1. **Browser CORS Preflight Specification:**  
   Because the request includes an `Authorization: Basic ...` header (a non-simple header), modern browsers enforce W3C CORS preflight checks and automatically send an HTTP `OPTIONS` request before sending the actual `GET` request.

2. **Server-Side Exception in CodeIgniter:**  
   The remote backend runs PHP CodeIgniter with `REST_Controller.php`. When it receives the preflight `OPTIONS` request, it attempts to invoke the controller action `index_options()`. Because `Patients.php` does not implement `index_options()`, PHP throws an uncaught TypeError:
   ```text
   Type: TypeError
   Message: call_user_func_array(): Argument #1 ($callback) must be a valid callback,
   class Patients does not have a method "index_options"
   Filename: .../application/libraries/REST_Controller.php
   Line Number: 739
   Status: 500 Internal Server Error
   ```

3. **Why Postman Succeeded:**  
   Postman is a desktop testing client and is not subject to browser origin sandboxing or CORS preflight checks. It sends the `GET` request directly to the server, bypassing `OPTIONS` completely.

### The Fix: Vite Development Proxy
In `vite.config.js`, we configure a reverse proxy for all `/api` requests:

```javascript
// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'https://demo.lupinary.com',
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
```

#### How this solves it:
1. The browser sends its request to `http://localhost:5173/api/patients...` (Same-Origin).
2. Because it is same-origin, **the browser does NOT emit a CORS preflight (`OPTIONS`) request**.
3. The Vite Node.js dev server proxies the `GET` request directly to `https://demo.lupinary.com`, receiving **HTTP 200 OK** and returning the JSON payload to the React app.

> 💡 **Interactive Diagnostic:** Click the **"Postman vs Browser (CORS)"** button in the app header to view live diagnostic comparison and test both direct and proxied requests in real time.

---

## 🛠️ Project Structure

```text
athira/
├── public/               # Public static assets
├── src/
│   ├── components/
│   │   ├── CORSInfoModal.jsx    # Explains & demonstrates the CORS preflight issue
│   │   ├── ErrorMessage.jsx     # Alert card with retry button
│   │   ├── LoadingSkeleton.jsx  # Loading banner & animated shimmer rows
│   │   ├── Pagination.jsx       # Page controls (Previous / Next / Page counter)
│   │   ├── PatientRow.jsx       # Single patient row with 6 columns & '-' placeholders
│   │   └── PatientTable.jsx     # Table container with clean column headers
│   ├── services/
│   │   └── api.js               # API service with Basic Auth & fetch logic
│   ├── App.css                  # UI styles, table alignment, responsive design
│   ├── App.jsx                  # Main application state & controls
│   ├── index.css                # CSS variables & base resets
│   └── main.jsx                 # React root entry point
├── index.html                   # HTML template with Google Fonts
├── package.json                 # Project dependencies & scripts
├── vite.config.js               # Vite configuration with API reverse proxy
└── README.md                    # Project documentation
```

---

## 🔑 API Specifications

- **Method:** `GET`
- **URL:** `https://demo.lupinary.com/api/patients` (proxied as `/api/patients`)
- **Query Params:**
  - `user_id = 1`
  - `clinic_id = 1`
  - `page_no = 0` (supports dynamic pagination)
- **Authentication:** Basic Auth
  - **Username:** `doctosmarttest`
  - **Password:** `$2y$12$9Za7UtNOljRUWVmVrq8yv.ZpuzEhK6yzI.gdKRCxw2EtUfvxySV3S`

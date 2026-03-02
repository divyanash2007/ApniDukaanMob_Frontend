# ApniDukaan Mobile Frontend

This directory contains the React frontend for the ApniDukaan Mobile application, optimized as a PWA (Progressive Web App) for mobile and tablet devices.

## Tech Stack
- **Framework**: React 18, Vite
- **Routing**: React Router DOM
- **Styling**: Tailwind CSS, Lucide React (Icons)
- **State Management**: Zustand
- **Features**: `html5-qrcode` for native barcode scanning

## Setup Instructions

1. **Install Dependencies**:
   Ensure you have Node.js installed, then run:
   ```bash
   npm install
   ```

2. **Environment Variables**:
   Create a `.env` file in this directory if you need to point to a remote backend. By default, the axios instance (`src/lib/axios.js`) might be configured to look at local paths or a specific deployed URL.
   ```bash
   VITE_API_URL=http://localhost:8000
   ```
   *(Ensure your `axios.js` file correctly consumes `import.meta.env.VITE_API_URL` if you use this).*

3. **Run Development Server**:
   ```bash
   npm run dev
   ```
   *To test on a mobile device on the same Wi-Fi network, use:*
   ```bash
   npm run dev --host
   ```
   Then navigate to the provided internal IP address (e.g., `http://192.168.x.x:5173`) on your phone.

4. **Build for Production**:
   ```bash
   npm run build
   ```
   This will generate optimized static files in the `dist` directory.

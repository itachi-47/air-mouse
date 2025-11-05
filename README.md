# air-mouse
<h1 align="center">🖱️ Air Mouse</h1>

<p align="center">
  <b>Control your cursor with motion.</b><br>
  ESP32-powered Air Mouse with real-time tracking, data logging, and a full-stack dashboard.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Frontend-React.js-blue?logo=react" />
  <img src="https://img.shields.io/badge/Backend-Node.js-green?logo=node.js" />
  <img src="https://img.shields.io/badge/Database-MongoDB-brightgreen?logo=mongodb" />
  <img src="https://img.shields.io/badge/Device-ESP32-orange?logo=espressif" />
  <img src="https://img.shields.io/github/license/itachi-47/air-mouse?color=yellow" />
</p>

---

## 🧠 Overview

**Air Mouse** is a motion-controlled mouse project that transforms an **ESP32** into a wireless air mouse using data from an **MPU6050 sensor**.  
The system uses a **Node.js backend** to handle data, a **React.js frontend** for a real-time dashboard, and **MongoDB** to log usage metrics.

---

## ⚙️ Tech Stack

| Layer | Technologies |
|-------|---------------|
| 🪶 **Frontend** | React.js, Tailwind CSS, Axios |
| ⚙️ **Backend** | Node.js, Express.js, Mongoose |
| 🗄️ **Database** | MongoDB (local or Atlas) |
| 🔌 **Hardware** | ESP32 + MPU6050 |
| 🧰 **Tools** | Git, npm, dotenv, CORS |

---

## 🧭 Folder Structure
air-mouse/
│
├── backend/ # Node.js API + Database logic

│ ├── controllers/

│ ├── models/

├── routes/

│ └── server.js

├── frontend/ # React Dashboard UI

│ ├── src/

│ ├── public/

│ └── package.json
│
└── README.md # Main project overview


---

## ⚡ Getting Started

### 🔹 Clone the repo
```bash
git clone https://github.com/itachi-47/air-mouse.git
cd air-mouse

🔹 Backend setup
cd backend
npm install
npm run dev

🔹 Frontend setup
cd frontend
npm install
npm start


🧩 Backend runs: http://localhost:5000
🎨 Frontend runs: http://localhost:3000

📡 ESP32 + Sensor Integration
The ESP32 reads motion data from the MPU6050 (Accelerometer + Gyroscope).
Data is sent to the backend (via Wi-Fi / HTTP / MQTT).
The backend logs data and updates the frontend in real time.
BLE Mouse emulation (BleMouse.h) is used for actual cursor control.

📊 Features

✅ Real-time motion tracking
✅ BLE Mouse support
✅ Data visualization dashboard
✅ MongoDB logging
✅ Calibration & settings panel
✅ Responsive dashboard UI

🧩 Future Goals

🚀 Add gesture recognition
🧠 ML-based motion prediction
☁️ Cloud sync (MongoDB Atlas)
🔁 WebSocket live streaming



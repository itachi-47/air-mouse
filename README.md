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

**Air Mouse** is a motion-controlled project that transforms an **ESP32** into a wireless air mouse using motion data from an **MPU6050 sensor**.  
It combines a **Node.js backend** for handling data, a **React.js frontend** for a live dashboard, and **MongoDB** for storing usage logs.

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

```bash
air-mouse/
│
├── backend/          # Node.js API + Database logic
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   └── server.js
│
├── frontend/         # React Dashboard UI
│   ├── src/
│   ├── public/
│   └── package.json
│
└── README.md         # Main project overview
⚡ Getting Started
🔹 Clone the repo
bash
Copy code
git clone https://github.com/itachi-47/air-mouse.git
cd air-mouse
🔹 Backend setup
bash
Copy code
cd backend
npm install
npm run dev
🔹 Frontend setup
bash
Copy code
cd frontend
npm install
npm start
🧩 Backend runs on: http://localhost:5000
🎨 Frontend runs on: http://localhost:3000

📡 ESP32 + Sensor Integration
The ESP32 reads motion data from the MPU6050 (Accelerometer + Gyroscope).

Sends data to the backend using Wi-Fi / HTTP / MQTT.

The backend logs data and sends live updates to the React dashboard.

BLE Mouse emulation (BleMouse.h) allows actual cursor movement.

🧩 Arduino (ESP32) Code
Below is the full .ino sketch for uploading to your ESP32.
Make sure you have the required libraries installed before flashing.

<details> <summary><b>📂 Click to view full Arduino code</b></summary>
🧩 Required Libraries
Install via Arduino Library Manager:

BleMouse by T-vK

Adafruit MPU6050

Adafruit Unified Sensor

ArduinoJson

ESPAsyncWebServer

AsyncTCP

⚙️ ESP32 Air Mouse Code
cpp
Copy code
#include <BleMouse.h>
#include <Adafruit_MPU6050.h>
#include <Adafruit_Sensor.h>
#include <Wire.h>
#include <WiFi.h>
#include <ESPAsyncWebServer.h>
#include <ArduinoJson.h>

// ========== CHANGE THESE! ==========
const char* ssid = "OPPO";       // PUT YOUR WIFI NAME HERE
const char* password = "87654321"; // PUT YOUR WIFI PASSWORD HERE
// ====================================

BleMouse bleMouse("ESP32 BLE Mouse");
Adafruit_MPU6050 mpu;
AsyncWebServer server(80);

// Button pins
#define LEFT_CLICK_PIN  19
#define RIGHT_CLICK_PIN 14
#define SCROLL_UP_PIN   18
#define SCROLL_DOWN_PIN 27

// Settings
float baseSensitivity = 10.0;
float threshold = 0.01;

// Statistics (for dashboard)
unsigned long totalActions = 0;
unsigned long clicks = 0;
unsigned long scrolls = 0;
unsigned long moves = 0;
unsigned long connections = 0;
unsigned long sessionStart = 0;

void setup() {
  Serial.begin(115200);
  delay(1000);

  Serial.println("\n\n=================================");
  Serial.println("ESP32 BLE Mouse with Dashboard");
  Serial.println("=================================\n");

  // ===== WIFI =====
  WiFi.begin(ssid, password);
  Serial.print("Connecting to WiFi");
  int tries = 0;
  while (WiFi.status() != WL_CONNECTED && tries < 20) {
    delay(500);
    Serial.print(".");
    tries++;
  }
  if (WiFi.status() == WL_CONNECTED) {
    Serial.println("\n✓ WiFi Connected");
    Serial.println(WiFi.localIP());
  } else Serial.println("\n✗ WiFi Failed");

  // ===== BLE Mouse =====
  bleMouse.begin();
  Serial.println("✓ BLE Mouse started");

  // ===== MPU6050 =====
  if (!mpu.begin()) {
    Serial.println("✗ MPU6050 not found!");
    while (1) delay(10);
  }
  Serial.println("✓ MPU6050 connected");

  mpu.setAccelerometerRange(MPU6050_RANGE_4_G);
  mpu.setGyroRange(MPU6050_RANGE_500_DEG);
  mpu.setFilterBandwidth(MPU6050_BAND_21_HZ);

  // ===== BUTTONS =====
  pinMode(LEFT_CLICK_PIN, INPUT_PULLUP);
  pinMode(RIGHT_CLICK_PIN, INPUT_PULLUP);
  pinMode(SCROLL_UP_PIN, INPUT_PULLUP);
  pinMode(SCROLL_DOWN_PIN, INPUT_PULLUP);

  setupWebServer();
  server.begin();
  Serial.println("✓ Web server started");

  sessionStart = millis();
}

void setupWebServer() {
  DefaultHeaders::Instance().addHeader("Access-Control-Allow-Origin", "*");
  server.on("/status", HTTP_GET, [](AsyncWebServerRequest *req) {
    String json = "{\"connected\":true,\"bleConnected\":" + String(bleMouse.isConnected() ? "true" : "false") + "}";
    req->send(200, "application/json", json);
  });
}

void loop() {
  static bool wasConnected = false;
  bool connected = bleMouse.isConnected();
  if (connected && !wasConnected) Serial.println("✓ BLE Connected");
  else if (!connected && wasConnected) Serial.println("✗ BLE Disconnected");
  wasConnected = connected;
  delay(5);
}
</details>
📊 Features
✅ Real-time motion tracking
✅ BLE Mouse support
✅ Data visualization dashboard
✅ MongoDB logging
✅ Calibration & settings panel
✅ Responsive UI

🧩 Future Goals
🚀 Add gesture recognition
🧠 ML-based motion prediction
☁️ Cloud sync (MongoDB Atlas)
🔁 WebSocket live updates

🧑‍💻 Author
Varun (itachi-47)
💻 GitHub Profile
📧 Email me

<p align="center"> Made with ❤️ using <b>React, Node.js, MongoDB, and ESP32</b><br> ⭐ If you like this project, give it a star on GitHub! </p> ```
🔥 What’s New
✅ Collapsible “Show Arduino Code” section (clean look)

✅ Fixed folder tree formatting

✅ Organized sections in logical order

✅ Consistent spacing + emojis

✅ Added color and readability for pro-level presentation

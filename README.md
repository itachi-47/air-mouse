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

**Air Mouse** is a motion-controlled project that turns an **ESP32** into a wireless air mouse using motion data from an **MPU6050 sensor**.  
It features a **Node.js backend** for handling data, a **React.js frontend** for a real-time dashboard, and **MongoDB** for logging usage metrics.

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

---

⚡ Getting Started
🔹 Clone the Repo
git clone https://github.com/itachi-47/air-mouse.git
cd air-mouse

🔹 Backend Setup
cd backend
npm install
npm run dev

🔹 Frontend Setup
cd frontend
npm install
npm start

🧩 Backend runs on: http://localhost:5000
🎨 Frontend runs on: http://localhost:3000

📡 ESP32 + Sensor Integration
The ESP32 reads motion data from the MPU6050 (Accelerometer + Gyroscope).
Sends data to the backend using Wi-Fi / HTTP / MQTT.
The backend logs usage data and updates the frontend in real time.
BLE Mouse emulation (BleMouse.h) enables actual cursor cont

---

🧩 Arduino (ESP32) Code

Below is the complete .ino sketch for uploading to your ESP32.
Make sure you’ve installed the required libraries before flashing.

<details> <summary><b>📂 Click to view full Arduino code</b></summary>
🧩 Required Libraries

Install via Arduino Library Manager:
BleMouse by T-vK
Adafruit MPU6050
Adafruit Unified Sensor
ArduinoJson
ESPAsyncWebServer
AsyncTCP

---

### ⚙️ ESP32 Air Mouse Code
```cpp
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

// Statistics (these will show on dashboard)
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

  // ===== CONNECT TO WIFI =====
  Serial.print("Connecting to WiFi: ");
  Serial.println(ssid);
  
  WiFi.begin(ssid, password);
  
  int attempts = 0;
  while (WiFi.status() != WL_CONNECTED && attempts < 20) {
    delay(500);
    Serial.print(".");
    attempts++;
  }
  
  if (WiFi.status() == WL_CONNECTED) {
    Serial.println("\n✓ WiFi Connected!");
    Serial.print("✓ IP Address: ");
    Serial.println(WiFi.localIP());
    Serial.println("\n>>> COPY THIS IP ADDRESS <<<\n");
  } else {
    Serial.println("\n✗ WiFi Failed! Check your WiFi name and password!");
  }

  // ===== START BLE MOUSE =====
  bleMouse.begin();
  Serial.println("✓ BLE Mouse started");

  // ===== START MPU6050 =====
  if (!mpu.begin()) {
    Serial.println("✗ MPU6050 not found!");
    while (1) delay(10);
  }
  Serial.println("✓ MPU6050 connected");
  
  mpu.setAccelerometerRange(MPU6050_RANGE_4_G);
  mpu.setGyroRange(MPU6050_RANGE_500_DEG);
  mpu.setFilterBandwidth(MPU6050_BAND_21_HZ);

  // ===== SETUP BUTTONS =====
  pinMode(LEFT_CLICK_PIN, INPUT_PULLUP);
  pinMode(RIGHT_CLICK_PIN, INPUT_PULLUP);
  pinMode(SCROLL_UP_PIN, INPUT_PULLUP);
  pinMode(SCROLL_DOWN_PIN, INPUT_PULLUP);
  Serial.println("✓ Buttons configured");

  // ===== SETUP WEB SERVER FOR DASHBOARD =====
  setupWebServer();
  server.begin();
  Serial.println("✓ Web server started");
  
  Serial.println("\n=================================");
  Serial.println("✓ Setup Complete!");
  Serial.println("=================================\n");
  
  sessionStart = millis();
}

void setupWebServer() {
  // Allow dashboard to access ESP32
  DefaultHeaders::Instance().addHeader("Access-Control-Allow-Origin", "*");
  DefaultHeaders::Instance().addHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  DefaultHeaders::Instance().addHeader("Access-Control-Allow-Headers", "Content-Type");

  // GET /status - Check if ESP32 is alive
  server.on("/status", HTTP_GET, [](AsyncWebServerRequest *request){
    String json = "{";
    json += "\"connected\":true,";
    json += "\"bleConnected\":" + String(bleMouse.isConnected() ? "true" : "false") + ",";
    json += "\"wifi\":true,";
    json += "\"ip\":\"" + WiFi.localIP().toString() + "\",";
    json += "\"rssi\":" + String(WiFi.RSSI());
    json += "}";
    request->send(200, "application/json", json);
  });

  // GET /stats - Real-time statistics
  server.on("/stats", HTTP_GET, [](AsyncWebServerRequest *request){
    String json = "{";
    json += "\"totalActions\":" + String(totalActions) + ",";
    json += "\"clicks\":" + String(clicks) + ",";
    json += "\"scrolls\":" + String(scrolls) + ",";
    json += "\"moves\":" + String(moves) + ",";
    json += "\"connections\":" + String(connections) + ",";
    json += "\"sessionDuration\":" + String((millis() - sessionStart) / 1000) + ",";
    json += "\"uptime\":" + String(millis() / 1000);
    json += "}";
    request->send(200, "application/json", json);
  });

  // GET /settings - Current settings
  server.on("/settings", HTTP_GET, [](AsyncWebServerRequest *request){
    String json = "{";
    json += "\"baseSensitivity\":" + String(baseSensitivity) + ",";
    json += "\"threshold\":" + String(threshold, 3);
    json += "}";
    request->send(200, "application/json", json);
  });

  // POST /settings - Update settings from dashboard
  server.on("/settings", HTTP_POST, [](AsyncWebServerRequest *request){}, NULL,
    [](AsyncWebServerRequest *request, uint8_t *data, size_t len, size_t index, size_t total){
      String body = "";
      for (size_t i = 0; i < len; i++) {
        body += (char)data[i];
      }
      
      // Simple JSON parsing
      if (body.indexOf("baseSensitivity") > 0) {
        int start = body.indexOf("baseSensitivity\":") + 17;
        int end = body.indexOf(",", start);
        if (end == -1) end = body.indexOf("}", start);
        String value = body.substring(start, end);
        baseSensitivity = value.toFloat();
        Serial.println("Sensitivity updated to: " + String(baseSensitivity));
      }
      
      if (body.indexOf("threshold") > 0) {
        int start = body.indexOf("threshold\":") + 11;
        int end = body.indexOf(",", start);
        if (end == -1) end = body.indexOf("}", start);
        String value = body.substring(start, end);
        threshold = value.toFloat();
        Serial.println("Threshold updated to: " + String(threshold));
      }
      
      request->send(200, "application/json", "{\"success\":true}");
    }
  );

  // OPTIONS for CORS
  server.on("/status", HTTP_OPTIONS, [](AsyncWebServerRequest *request){
    request->send(200);
  });
  server.on("/stats", HTTP_OPTIONS, [](AsyncWebServerRequest *request){
    request->send(200);
  });
  server.on("/settings", HTTP_OPTIONS, [](AsyncWebServerRequest *request){
    request->send(200);
  });
}

void loop() {
  static bool wasConnected = false;
  bool isConnected = bleMouse.isConnected();
  
  if (isConnected && !wasConnected) {
    connections++;
    Serial.println("✓ BLE Mouse Connected!");
  } else if (!isConnected && wasConnected) {
    Serial.println("✗ BLE Mouse Disconnected");
  }
  wasConnected = isConnected;

  if (isConnected) {
    sensors_event_t a, g, temp;
    mpu.getEvent(&a, &g, &temp);

    float gyroX = g.gyro.x;
    float gyroY = g.gyro.y;
    float gyroZ = g.gyro.z;

    float moveX = gyroZ;
    float moveY = gyroY;

    if (fabs(moveX) < threshold) moveX = 0;
    if (fabs(moveY) < threshold) moveY = 0;

    float speed = sqrt(moveX * moveX + moveY * moveY);
    float dynamicSensitivity = baseSensitivity * (1 + speed * 0.2);

    moveX *= dynamicSensitivity;
    moveY *= dynamicSensitivity + 2;

    if ((int)moveX != 0 || (int)moveY != 0) {
      bleMouse.move((int)-moveX, (int)moveY);
      moves++;
      totalActions++;
    }

    static bool leftWasPressed = false;
    bool leftPressed = digitalRead(LEFT_CLICK_PIN) == LOW;
    
    if (leftPressed && !leftWasPressed) {
      bleMouse.press(MOUSE_LEFT);
      clicks++;
      totalActions++;
    } else if (!leftPressed && leftWasPressed) {
      bleMouse.release(MOUSE_LEFT);
    }
    leftWasPressed = leftPressed;

    static bool rightWasPressed = false;
    bool rightPressed = digitalRead(RIGHT_CLICK_PIN) == LOW;
    
    if (rightPressed && !rightWasPressed) {
      bleMouse.press(MOUSE_RIGHT);
      clicks++;
      totalActions++;
    } else if (!rightPressed && rightWasPressed) {
      bleMouse.release(MOUSE_RIGHT);
    }
    rightWasPressed = rightPressed;

    if (digitalRead(SCROLL_UP_PIN) == LOW) {
      bleMouse.move(0, 0, 1);
      scrolls++;
      totalActions++;
      delay(150);
    }

    if (digitalRead(SCROLL_DOWN_PIN) == LOW) {
      bleMouse.move(0, 0, -1);
      scrolls++;
      totalActions++;
      delay(150);
    }
  }

  delay(5);
}

---

📊 Features

✅ Real-time motion tracking
✅ BLE Mouse emulation
✅ Data visualization dashboard
✅ MongoDB logging
✅ Settings & calibration panel
✅ Responsive UI

🧩 Future Goals

🚀 Gesture-based control
🧠 ML-powered motion prediction
☁️ Cloud sync (MongoDB Atlas)
🔁 WebSocket live updates

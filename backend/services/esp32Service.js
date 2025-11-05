const axios = require('axios');

// YOUR ESP32 IP ADDRESS - ALREADY SET!
const ESP32_IP = 'http://172.20.220.228';

class ESP32Service {
  constructor() {
    this.baseURL = ESP32_IP;
    this.connected = false;
  }

  // Check if ESP32 is reachable
  async checkConnection() {
    try {
      const response = await axios.get(`${this.baseURL}/status`, { timeout: 2000 });
      this.connected = true;
      return response.data;
    } catch (error) {
      this.connected = false;
      return null;
    }
  }

  // Get current settings from ESP32
  async getSettings() {
    try {
      const response = await axios.get(`${this.baseURL}/settings`, { timeout: 2000 });
      return response.data;
    } catch (error) {
      throw new Error('Cannot connect to ESP32');
    }
  }

  // Update settings on ESP32
  async updateSettings(settings) {
    try {
      const response = await axios.post(`${this.baseURL}/settings`, settings, {
        headers: { 'Content-Type': 'application/json' },
        timeout: 2000
      });
      return response.data;
    } catch (error) {
      throw new Error('Cannot update ESP32 settings');
    }
  }

  // Get statistics from ESP32
  async getStats() {
    try {
      const response = await axios.get(`${this.baseURL}/stats`, { timeout: 2000 });
      return response.data;
    } catch (error) {
      throw new Error('Cannot get ESP32 stats');
    }
  }

  // Reset statistics
  async resetStats() {
    try {
      const response = await axios.post(`${this.baseURL}/stats/reset`, {}, { timeout: 2000 });
      return response.data;
    } catch (error) {
      throw new Error('Cannot reset ESP32 stats');
    }
  }

  // Get device info
  async getDeviceInfo() {
    try {
      const response = await axios.get(`${this.baseURL}/info`, { timeout: 2000 });
      return response.data;
    } catch (error) {
      throw new Error('Cannot get ESP32 info');
    }
  }
}

module.exports = new ESP32Service();
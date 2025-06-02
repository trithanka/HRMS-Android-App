import axios from "axios";
import { Platform } from "react-native";

// Use your actual machine's IP address here
const LOCAL_IP = '192.168.81.53'; // Your machine's IP address

export const API = axios.create({
  // For Android Emulator, use 10.0.2.2
  // For iOS Simulator, use localhost
  // For physical devices, use your machine's IP address
  baseURL: Platform.select({
    android: `http://${LOCAL_IP}:4012`,
    ios: `http://${LOCAL_IP}:4012`,
    web: 'http://localhost:4012',
  }),
});

// Add request interceptor
API.interceptors.request.use(
  (config) => {
    console.log('🚀 Request:', config.method?.toUpperCase(), (config.baseURL || '') + (config.url || ''));
    console.log('Request Data:', config.data);
    return config;
  },
  (error) => {
    console.error('❌ Request Error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor
API.interceptors.response.use(
  (response) => {
    console.log('✅ Response:', response.status, response.config.url);
    console.log('Response Data:', response.data);
    return response;
  },
  (error) => {
    console.error('❌ Response Error:', error.message);
    console.error('Error Config:', error.config);
    if (error.response) {
      console.error('Error Status:', error.response.status);
      console.error('Error Data:', error.response.data);
    }
    return Promise.reject(error);
  }
);

// Production URL for reference:
// baseURL: "https://hrms.skillmissionassam.org/nw2",
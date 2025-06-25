// src/services/api.ts
import axios from 'axios';
import type {
  AxiosInstance,
  AxiosResponse,
  AxiosError,
} from 'axios';

export interface Salon {
  id: number;
  name: string;
  services: Service[];
}

export interface Service {
  id: number;
  name: string;
  price: number; // Euros
  duration_minutes: number;
}

export interface Booking {
  id: number;
  appointment_time: string; // ISO string
  service_name: string;
  salon_name: string;
}

export interface UserLoginResponse {
  access_token: string;
  token_type: string;
}

export interface UserProfile {
  id: number;
  email: string;
  name: string;
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

// Create Axios instance
const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('authToken');
    }
    return Promise.reject(error.response?.data || error.message);
  }
);

// API Methods
export const fetchSalons = (): Promise<AxiosResponse<Salon[]>> => {
  return api.get('/salons');
};

export const fetchSalonById = (
  salonId: number | string
): Promise<AxiosResponse<Salon>> => {
  return api.get(`/salons/${salonId}`);
};

export const login = (
  username: string,
  password: string
): Promise<AxiosResponse<UserLoginResponse>> => {
  const params = new URLSearchParams();
  params.append('username', username);
  params.append('password', password);
  
  return api.post('/token', params, {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });
};

export const fetchUserProfile = (): Promise<AxiosResponse<UserProfile>> => {
  return api.get('/users/me');
};

export const fetchBookings = (): Promise<AxiosResponse<Booking[]>> => {
  return api.get('/bookings');
};

export const createBooking = (
  serviceId: number,
  appointmentTime: string
): Promise<AxiosResponse<Booking>> => {
  return api.post('/bookings', {
    service_id: serviceId,
    appointment_time: appointmentTime,
  });
};

// Export the API instance if needed elsewhere
export default api;
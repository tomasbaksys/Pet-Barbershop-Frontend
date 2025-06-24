// services/api.ts

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

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

function getAuthHeaders(token?: string) {
  return token
    ? {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      }
    : {
        "Content-Type": "application/json",
      };
}

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const errorMessage = errorData.detail || response.statusText;
    throw new Error(errorMessage);
  }
  return response.json();
}

export async function fetchSalons(token?: string): Promise<Salon[]> {
  const res = await fetch(`${API_BASE_URL}/salons`, {
    headers: getAuthHeaders(token),
  });
  return handleResponse<Salon[]>(res);
}

export async function fetchSalonById(salonId: number | string, token?: string): Promise<Salon> {
  const res = await fetch(`${API_BASE_URL}/salons/${salonId}`, {
    headers: getAuthHeaders(token),
  });
  return handleResponse<Salon>(res);
}

export async function login(username: string, password: string): Promise<UserLoginResponse> {
  const res = await fetch(`${API_BASE_URL}/token`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      username,
      password,
    }),
  });
  return handleResponse<UserLoginResponse>(res);
}

export async function fetchUserProfile(token: string) {
  const res = await fetch(`${API_BASE_URL}/users/me`, {
    headers: getAuthHeaders(token),
  });
  return handleResponse(res);
}

export async function fetchBookings(token: string) {
  const res = await fetch(`${API_BASE_URL}/bookings`, {
    headers: getAuthHeaders(token),
  });
  return handleResponse<Booking[]>(res);
}

export async function createBooking(
  token: string,
  serviceId: number,
  appointmentTime: string
) {
  const res = await fetch(`${API_BASE_URL}/bookings`, {
    method: "POST",
    headers: getAuthHeaders(token),
    body: JSON.stringify({
      service_id: serviceId,
      appointment_time: appointmentTime,
    }),
  });
  return handleResponse<Booking>(res);
}

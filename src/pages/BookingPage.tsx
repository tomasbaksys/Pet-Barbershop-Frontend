// src/pages/BookingPage.tsx
import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";

interface Salon {
  id: number;
  name: string;
}

interface Service {
  id: number;
  name: string;
  price: number; // price in EUR cents or whole number euros
  duration_minutes: number;
  salon_id: number;
}

interface BookingPayload {
  service_id: number;
  appointment_time: string; // ISO string
}

const BookingPage: React.FC = () => {
  const { token } = useAuth(); // Use token from context

  const [salons, setSalons] = useState<Salon[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [selectedSalonId, setSelectedSalonId] = useState<number | null>(null);
  const [selectedServiceId, setSelectedServiceId] = useState<number | null>(null);
  const [appointmentTime, setAppointmentTime] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Fetch salons on mount
  useEffect(() => {
    const fetchSalons = async () => {
      try {
        setLoading(true);
        const res = await fetch("/api/salons", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!res.ok) throw new Error("Nepavyko gauti salonų duomenų.");
        const data = await res.json();
        setSalons(data);
      } catch (err: any) {
        setError(err.message || "Įvyko klaida kraunant salonus.");
      } finally {
        setLoading(false);
      }
    };
    if (token) fetchSalons();
    else setError("Reikia prisijungti");
  }, [token]);

  // Fetch services when salon changes
  useEffect(() => {
    const fetchServices = async () => {
      if (!selectedSalonId) {
        setServices([]);
        return;
      }
      try {
        setLoading(true);
        const res = await fetch(`/api/salons/${selectedSalonId}/services`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!res.ok) throw new Error("Nepavyko gauti paslaugų duomenų.");
        const data = await res.json();
        setServices(data);
      } catch (err: any) {
        setError(err.message || "Įvyko klaida kraunant paslaugas.");
      } finally {
        setLoading(false);
      }
    };
    if (token) fetchServices();
  }, [selectedSalonId, token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    if (!token) {
      setError("Reikia prisijungti");
      return;
    }
    
    if (!selectedServiceId) {
      setError("Pasirinkite paslaugą.");
      return;
    }
    if (!appointmentTime) {
      setError("Pasirinkite datą ir laiką.");
      return;
    }

    const payload: BookingPayload = {
      service_id: selectedServiceId,
      appointment_time: new Date(appointmentTime).toISOString(),
    };

    try {
      setLoading(true);
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.detail || "Rezervacija nepavyko.");
      }
      setSuccessMessage("Rezervacija sėkminga!");
      // Clear form
      setSelectedSalonId(null);
      setSelectedServiceId(null);
      setAppointmentTime("");
      setServices([]);
    } catch (err: any) {
      setError(err.message || "Įvyko klaida rezervuojant.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="booking-page container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Rezervacija</h1>

      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 border border-red-400 rounded">
          {error}
        </div>
      )}

      {successMessage && (
        <div className="mb-4 p-3 bg-green-100 text-green-700 border border-green-400 rounded">
          {successMessage}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6 max-w-md">
        {/* Salon selector */}
        <label htmlFor="salon" className="block font-semibold">
          Pasirinkite saloną:
        </label>
        <select
          id="salon"
          value={selectedSalonId ?? ""}
          onChange={(e) => setSelectedSalonId(Number(e.target.value) || null)}
          className="w-full border rounded p-2"
          disabled={loading || !token}
          required
        >
          <option value="" disabled>
            -- Pasirinkite --
          </option>
          {salons.map((salon) => (
            <option key={salon.id} value={salon.id}>
              {salon.name}
            </option>
          ))}
        </select>

        {/* Services selector */}
        <label htmlFor="service" className="block font-semibold">
          Pasirinkite paslaugą:
        </label>
        <select
          id="service"
          value={selectedServiceId ?? ""}
          onChange={(e) => setSelectedServiceId(Number(e.target.value) || null)}
          className="w-full border rounded p-2"
          disabled={!selectedSalonId || loading || !token}
          required
        >
          <option value="" disabled>
            -- Pasirinkite --
          </option>
          {services.map((service) => (
            <option key={service.id} value={service.id}>
              {service.name} - {(service.price / 100).toLocaleString("lt-LT", {
                style: "currency",
                currency: "EUR",
              })}
              , {service.duration_minutes} min.
            </option>
          ))}
        </select>

        {/* Appointment datetime picker */}
        <label htmlFor="appointmentTime" className="block font-semibold">
          Pasirinkite datą ir laiką:
        </label>
        <input
          type="datetime-local"
          id="appointmentTime"
          value={appointmentTime}
          onChange={(e) => setAppointmentTime(e.target.value)}
          className="w-full border rounded p-2"
          min={new Date().toISOString().slice(0, 16)} // no past dates
          disabled={loading || !token}
          required
        />

        <button
          type="submit"
          className="w-full bg-blue-600 text-white font-semibold py-2 rounded hover:bg-blue-700 disabled:opacity-50"
          disabled={loading || !token}
        >
          {loading ? "Kraunama..." : "Rezervuoti"}
        </button>
      </form>
    </main>
  );
};

export default BookingPage;

import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

interface Salon {
  id: number;
  name: string;
}

const HomePage: React.FC = () => {
  const { token } = useAuth();
  const [salons, setSalons] = useState<Salon[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSalons = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/salons", {
          headers: token
            ? { Authorization: `Bearer ${token}` }
            : undefined,
        });
        if (!response.ok) throw new Error("Nepavyko gauti salonų.");
        const data = await response.json();
        setSalons(data);
      } catch (err: any) {
        setError(err.message || "Įvyko klaida.");
      } finally {
        setLoading(false);
      }
    };

    fetchSalons();
  }, [token]);

  return (
    <main className="container mx-auto px-6 py-12">
      <section className="mb-12 text-center">
        <h1 className="text-4xl font-extrabold mb-4">
          Sveiki atvykę į Pet Barbershop!
        </h1>
        <p className="text-lg text-gray-700 max-w-xl mx-auto">
          Mūsų salonai pasirūpins Jūsų augintinio grožiu ir sveikata. Rezervuokite
          paslaugas patogiai internetu.
        </p>
        <div className="mt-8 space-x-4">
          <Link
            to="/booking"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded shadow"
          >
            Rezervuoti paslaugą
          </Link>
          {!token && (
            <Link
              to="/login"
              className="inline-block bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-3 px-6 rounded shadow"
            >
              Prisijungti
            </Link>
          )}
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-6">Mūsų salonai</h2>

        {loading && <p>Kraunama salonų informacija...</p>}
        {error && (
          <p className="text-red-600 font-semibold">
            Įvyko klaida: {error}
          </p>
        )}
        {!loading && salons.length === 0 && (
          <p>Šiuo metu salonų nėra.</p>
        )}

        <ul className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {salons.map((salon) => (
            <li
              key={salon.id}
              className="border rounded-lg p-6 shadow hover:shadow-lg transition-shadow"
            >
              <h3 className="text-xl font-semibold mb-2">{salon.name}</h3>
              <Link
                to={`/salons/${salon.id}`}
                className="text-blue-600 hover:underline"
              >
                Peržiūrėti paslaugas
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
};

export default HomePage;
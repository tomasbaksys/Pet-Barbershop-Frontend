import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

interface Service {
  id: number;
  name: string;
  price: number; // in Euro cents or Euro
  duration_minutes: number;
}

interface Salon {
  id: number;
  name: string;
  services: Service[];
}

const SalonPage: React.FC = () => {
  const { salonId } = useParams<{ salonId: string }>();
  const [salon, setSalon] = useState<Salon | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchSalon() {
      try {
        const response = await fetch(`/api/salons/${salonId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
          },
        });
        if (!response.ok) throw new Error("Nepavyko gauti salonų informacijos.");
        const data = await response.json();
        setSalon(data);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    }
    fetchSalon();
  }, [salonId]);

  if (loading) return <p className="text-center mt-20">Įkeliama...</p>;
  if (error) return <p className="text-center mt-20 text-red-600">{error}</p>;
  if (!salon) return <p className="text-center mt-20">Salonų nerasta.</p>;

  return (
    <main className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow mt-12">
      <h1 className="text-3xl font-bold mb-6">{salon.name}</h1>

      <section>
        <h2 className="text-2xl font-semibold mb-4">Paslaugos</h2>
        {salon.services.length === 0 ? (
          <p>Šis salonas neturi paslaugų.</p>
        ) : (
          <ul className="space-y-4">
            {salon.services.map((service) => (
              <li
                key={service.id}
                className="border p-4 rounded-md flex justify-between items-center"
              >
                <div>
                  <h3 className="text-xl font-medium">{service.name}</h3>
                  <p className="text-gray-600">
                    Trukmė: {service.duration_minutes} min.
                  </p>
                </div>
                <div className="text-lg font-semibold">
                  {service.price.toLocaleString("lt-LT", {
                    style: "currency",
                    currency: "EUR",
                  })}
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
};

export default SalonPage;

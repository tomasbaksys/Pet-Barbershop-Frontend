import React, { useEffect, useState } from "react";

interface UserProfile {
  username: string;
  isSalonOwner: boolean;
  email?: string; // Add any other fields as needed
}

const ProfilePage: React.FC = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch profile data from backend API
  useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await fetch("/api/profile", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
          },
        });
        if (!res.ok) throw new Error("Nepavyko gauti profilio duomenų.");
        const data = await res.json();
        setProfile(data);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    }
    fetchProfile();
  }, []);

  if (loading) return <p className="text-center mt-20">Įkeliama...</p>;

  if (error) return <p className="text-center mt-20 text-red-600">{error}</p>;

  if (!profile) return <p className="text-center mt-20">Profilis nerastas.</p>;

  return (
    <main className="max-w-3xl mx-auto p-8 bg-white rounded-lg shadow mt-12">
      <h1 className="text-2xl font-semibold mb-6">Mano profilis</h1>

      <div className="mb-4">
        <label className="block font-medium text-gray-700 mb-1">Vartotojo vardas:</label>
        <p className="text-lg">{profile.username}</p>
      </div>

      <div className="mb-4">
        <label className="block font-medium text-gray-700 mb-1">El. paštas:</label>
        <p className="text-lg">{profile.email || "Nenurodyta"}</p>
      </div>

      <div className="mb-4">
        <label className="block font-medium text-gray-700 mb-1">Savininko teisės:</label>
        <p className="text-lg">{profile.isSalonOwner ? "Taip" : "Ne"}</p>
      </div>

      {/* TODO: Add editable form fields and update profile functionality */}

    </main>
  );
};

export default ProfilePage;

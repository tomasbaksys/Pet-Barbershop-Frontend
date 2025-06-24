import React from "react";
import LoginForm from "../components/LoginForm";

const LoginPage: React.FC = () => {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-6 py-12">
      <section className="w-full max-w-md bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-bold mb-6 text-center text-gray-900">
          Prisijungimas
        </h1>
        <LoginForm />
      </section>
    </main>
  );
};

export default LoginPage;

import React from "react";
import RegisterForm from "../components/RegisterForm/RegisterForm";

const RegisterPage: React.FC = () => {
  return (
    <main className="page-container">
      <h1>Registracija</h1>
      <RegisterForm />
    </main>
  );
};

export default RegisterPage;
